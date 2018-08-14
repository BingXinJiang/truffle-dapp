pragma solidity ^0.4.23;

// * dice2.win - fair games that pay Ether.
//
// * Ethereum smart contract, deployed at 0xD1CEeeefA68a6aF0A5f6046132D986066c7f9426.
//
// * Uses hybrid commit-reveal + block hash random number generation that is immune
//   to tampering by players, house and miners. Apart from being fully transparent,
//   this also allows arbitrarily high bets.
//
// * Refer to https://dice2.win/whitepaper.pdf for detailed description and proofs.

contract Dice2Win {
    /// *** Constants section

    // Each bet is deducted 1% in favour of the house, but no less than some minimum.
    // The lower bound is dictated by gas costs of the settleBet transaction, providing
    // headroom for up to 10 Gwei prices.
    uint constant HOUSE_EDGE_PERCENT = 1;
    uint constant HOUSE_EDGE_MINIMUM_AMOUNT = 0.0003 ether;

    // Bets lower than this amount do not participate in jackpot rolls (and are
    // not deducted JACKPOT_FEE).
    uint constant MIN_JACKPOT_BET = 0.1 ether;

    // Chance to win jackpot (currently 0.1%) and fee deducted into jackpot fund.
    uint constant JACKPOT_MODULO = 1000;
    uint constant JACKPOT_FEE = 0.001 ether;

    // There is minimum and maximum bets.
    uint constant MIN_BET = 0.01 ether;
    uint constant MAX_AMOUNT = 300000 ether;

    // Modulo is a number of equiprobable(等概率) outcomes in a game:
    //  - 2 for coin flip
    //  - 6 for dice
    //  - 6*6 = 36 for double dice
    //  - 100 for etheroll
    //  - 37 for roulette(轮盘赌)
    //  etc.
    // It's called so because 256-bit entropy is treated like a huge integer and the remainder of its division by modulo(模) is considered bet outcome.
    uint constant MAX_MODULO = 100;

    // For modulos below this threshold(阈值、门槛) rolls are checked against a bit mask, thus allowing betting on any combination of outcomes. For example, given modulo 6 for dice, 101000 mask (base-2, big endian) means betting on 4 and 6; for games with modulos higher than threshold (Etheroll), a simple limit is used, allowing betting on any outcome in [0, N) range.
    // 对于低于此阈值的模数（阈值，门槛），将根据位掩码检查卷，从而允许对结果的任何组合进行投注。 例如，给定模6的骰子，101000掩模（base-2，big endian）意味着投注4和6; 对于模数高于阈值（Etheroll）的游戏，使用简单限制，允许投注[0，N]范围内的任何结果。

    // The specific value is dictated by the fact that 256-bit intermediate multiplication result allows implementing population count efficiently for numbers that are up to 42 bits, and 40 is the highest multiple of eight below 42.
    // 具体值取决于256位中间乘法结果允许有效地实现最多42位数的种群计数，而40是42以下8位的最高倍数。
    uint constant MAX_MASK_MODULO = 40;

    // This is a check on bet mask overflow.
    uint constant MAX_BET_MASK = 2 ** MAX_MASK_MODULO;

    // EVM BLOCKHASH opcode can query no further than 256 blocks into the past. 
    // Given that settleBet uses block hash of placeBet as one of complementary entropy sources, we cannot process bets older than this threshold. 
    // On rare occasions(场合) dice2.win croupier(赌场上的主管) may fail to invoke(调用) settleBet in this timespan(时间跨度) due to technical issues or extreme Ethereum congestion(阻塞); such bets can be refunded via invoking refundBet.
    // EVM BLOCKHASH 不能查询256个区块之前的区块。
    // 由于settleBet使用placeBet作为加密源之一，因此我们不能处理早于这个的下注。
    // 在少数场景下，dice2.win在这个时间跨度下由于技术原因或者以太网络阻塞的原因settleBet的调用可能会失败。这样的下注可通过调用退款函数退回资金。
    uint constant BET_EXPIRATION_BLOCKS = 250;

    // Some deliberately(故意) invalid address to initialize the secret signer with.
    // Forces maintainers to invoke setSecretSigner before processing any bets.
    // 一些故意无效的地址用于初始化秘密签名者。
    // 强制维护者在处理任何下注之前调用setSecretSigner。
    address constant DUMMY_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    // Standard contract ownership transfer.
    address public owner;
    address private nextOwner;

    // Adjustable max bet profit. Used to cap bets against dynamic odds.
    // 可调整的最大赌注利润。用于限制动态赔率的投注。
    uint public maxProfit;

    // The address corresponding to a private key used to sign placeBet commits.
    // 与私钥对应的地址用来注册placeBet的提交。
    address public secretSigner;

    // Accumulated jackpot fund.
    // 累积奖金池
    uint128 public jackpotSize;

    // Funds that are locked in potentially winning bets. 
    // Prevents contract from committing to bets it cannot pay out.
    // 被锁定在潜在获胜赌注中的资金
    // 阻止提交没有支付能力的赌注。
    uint128 public lockedInBets;

    // A structure representing a single bet.、
    // 一个结构体代表一个独立的赌注。
    struct Bet {
        // Wager amount in wei.
        // 以位为单位的赌注
        uint amount;
        // Modulo of a game.
        // 游戏的模(游戏结果的可能性集合)
        uint8 modulo;
        // Number of winning outcomes, used to compute winning payment (* modulo/rollUnder), and used instead of mask for games with modulo > MAX_MASK_MODULO.
        // 获胜结果的数量，用来计算中奖金额(*modulo/rollUnder)，如果modulo>MAX_MASK_MODULO，则使用mask替换modulo
        uint8 rollUnder;
        // Block number of placeBet tx.
        // 放置placeBet交易的区块。
        uint40 placeBlockNumber;
        // Bit mask representing winning bet outcomes (see MAX_MASK_MODULO comment).
        // 位掩码代表获胜的投注结果。
        uint40 mask;
        // Address of a gambler, used to pay out winning bets.
        // 赌徒地址，用于支付获胜的赌注。
        address gambler;
    }

    // Mapping from commits to all currently active & processed bets.
    // 当前活跃的下注。
    mapping (uint => Bet) bets;

    // Events that are issued to make statistic recovery easier.
    event FailedPayment(address indexed beneficiary, uint amount);
    event Payment(address indexed beneficiary, uint amount);
    event JackpotPayment(address indexed beneficiary, uint amount);

    // Constructor. Deliberately(故意) does not take any parameters.
    constructor () public {
        owner = msg.sender;
        secretSigner = DUMMY_ADDRESS;
    }

    // Standard modifier on methods invokable only by contract owner.
    // 只能由合约拥有者调用的方法修饰符。
    modifier onlyOwner {
        require (msg.sender == owner, "OnlyOwner methods called by non-owner.");
        _;
    }

    // Standard contract ownership transfer implementation,
    // 合约所有权转移函数实现
    function approveNextOwner(address _nextOwner) external onlyOwner {
        require (_nextOwner != owner, "Cannot approve current owner.");
        nextOwner = _nextOwner;
    }

    function acceptNextOwner() external {
        require (msg.sender == nextOwner, "Can only accept preapproved new owner.");
        owner = nextOwner;
    }

    // Fallback function deliberately left empty. It's primary use case is to top up the bank roll.
    // 预留功能。它的主要功能是top up the bank roll
    function () public payable {
    }

    // See comment for "secretSigner" variable.
    function setSecretSigner(address newSecretSigner) external onlyOwner {
        secretSigner = newSecretSigner;
    }

    // Change max bet reward. Setting this to zero effectively disables betting.
    // 修改最大的投注奖励。将它设为0，将是投注失效。
    function setMaxProfit(uint _maxProfit) public onlyOwner {
        require (_maxProfit < MAX_AMOUNT, "maxProfit should be a sane number.");
        maxProfit = _maxProfit;
    }

    // This function is used to bump up the jackpot fund. Cannot be used to lower it.
    // 该函数用来提高累积奖金，不能用于减少它。
    function increaseJackpot(uint increaseAmount) external onlyOwner {
        require (increaseAmount <= address(this).balance, "Increase amount larger than balance.");
        require (jackpotSize + lockedInBets + increaseAmount <= address(this).balance, "Not enough funds.");
        jackpotSize += uint128(increaseAmount);
    }

    // Funds withdrawal to cover costs of dice2.win operation.
    // 提取资金支付dice2.win的操作费用。
    function withdrawFunds(address beneficiary, uint withdrawAmount) external onlyOwner {
        require (withdrawAmount <= address(this).balance, "Increase amount larger than balance.");
        require (jackpotSize + lockedInBets + withdrawAmount <= address(this).balance, "Not enough funds.");
        sendFunds(beneficiary, withdrawAmount, withdrawAmount);
    }

    // Contract may be destroyed only when there are no ongoing bets, either settled or refunded. All funds are transferred to contract owner.
    // 当没有正在进行的投注时，合约将被销毁。所有的资金被转移给合约的拥有者。
    function kill() external onlyOwner {
        require (lockedInBets == 0, "All bets should be processed (settled or refunded) before self-destruct.");
        selfdestruct(owner);
    }

    /// *** Betting logic

    // Bet states:
    //  amount == 0 && gambler == 0 - 'clean' (can place a bet 可以进行投注)
    //  amount != 0 && gambler != 0 - 'active' (can be settled or refunded 可以结算或者退款)
    //  amount == 0 && gambler != 0 - 'processed' (can clean storage 可以清除storage)

    // Bet placing transaction - issued by the player.
    // 投注交易-由游戏玩家操作
    //  betMask         - bet outcomes bit mask for modulo <= MAX_MASK_MODULO,
    //                    [0, betMask) for larger modulos.
    //  modulo          - game modulo.
    //  commitLastBlock - number of the maximum block where "commit" is still considered valid.
    //  commit          - Keccak256 hash of some secret "reveal" random number, to be supplied
    //                    by the dice2.win croupier bot in the settleBet transaction. Supplying
    //                    "commit" ensures that "reveal" cannot be changed behind the scenes
    //                    after placeBet have been mined.
    //  提交：一些加密随机数的hash值，由settleBet交易中的主管dice2.win提供。确保下注已经被记录挖矿后，不能被改变。
    //  r, s            - components of ECDSA signature of (commitLastBlock, commit). v is
    //                    guaranteed to always equal 27.
    //
    // Commit, being essentially random 256-bit number, is used as a unique bet identifier in
    // the 'bets' mapping.
    // Commit 随机的256位数字，被用来作为投注映射的唯一标示。
    //
    // Commits are signed with a block limit to ensure that they are used at most once - otherwise it would be possible for a miner to place a bet with a known commit/reveal pair and tamper(篡改) with the blockhash.
    //  commit被区块的限制注册以确保他们最多被使用一次，否则矿工可能使用已知的提交篡改区块哈希。
    // Croupier(赌场上的总管人) guarantees that commitLastBlock will always be not greater than placeBet block number plus BET_EXPIRATION_BLOCKS. See whitepaper for details.
    // 管理者确保‘commitLastBlock’总是不大于‘placeBet’区块的数量加上‘BET_EXPIRATION_BLOCKS’。
    // 获取当前区块的number
    function getNowBlockNumber() external view returns(uint nowBlockNumber){
        nowBlockNumber = block.number;
    }
    // function getPlaceBetsNow() external returns(mapping (uint => Bet) myBets
    // ){
    //     myBets = bets;
    // }
    function placeBet(uint betMask, uint modulo, uint commitLastBlock, uint commit, bytes32 r, bytes32 s) external payable {
        // Check that the bet is in 'clean' state.
        // 检测投注是否处在‘clean’状态。
        Bet storage bet = bets[commit];
        require (bet.gambler == address(0), "Bet should be in a 'clean' state.");

        // Validate(验证) input data ranges.
        // 验证数据的范围
        uint amount = msg.value;
        require (modulo > 1 && modulo <= MAX_MODULO, "Modulo should be within range.");
        require (amount >= MIN_BET && amount <= MAX_AMOUNT, "Amount should be within range.");
        require (betMask > 0 && betMask < MAX_BET_MASK, "Mask should be within range.");

        // Check that commit is valid - it has not expired and its signature is valid.
        // 验证提交是有效的，没有过期，并且签名有效。
        require (block.number <= commitLastBlock, "Commit has expired.");
        bytes32 signatureHash = keccak256(abi.encodePacked(uint40(commitLastBlock), commit));
        require (secretSigner == ecrecover(signatureHash, 27, r, s), "ECDSA signature is not valid.");

        uint rollUnder;
        uint mask;

        if (modulo <= MAX_MASK_MODULO) {
            // Small modulo games specify bet outcomes via bit mask. 
            // 小modulo游戏通过位掩码指定投注结果。
            // rollUnder is a number of 1 bits in this mask (population count). 
            // rollUnder是个一个字节的数字。
            // This magic looking formula is an efficient way to compute population count on EVM for numbers below 2**40. 
            // 这个看起来具有魔力的公式，
            // For detailed proof consult the dice2.win whitepaper.
            rollUnder = ((betMask * POPCNT_MULT) & POPCNT_MASK) % POPCNT_MODULO;
            mask = betMask;
        } else {
            // Larger modulos specify the right edge of half-open interval of winning bet outcomes.
            // 较大的模数指定获胜投注结果的半开区间的右边缘。
            require (betMask > 0 && betMask <= modulo, "High modulo range, betMask larger than modulo.");
            rollUnder = betMask;
        }

        // Winning amount and jackpot increase.
        uint possibleWinAmount;
        uint jackpotFee;

        (possibleWinAmount, jackpotFee) = getDiceWinAmount(amount, modulo, rollUnder);

        // Enforce max profit limit.
        // 最大盈利限制。
        require (possibleWinAmount <= amount + maxProfit, "maxProfit limit violation.");

        // Lock funds.
        lockedInBets += uint128(possibleWinAmount);
        jackpotSize += uint128(jackpotFee);

        // Check whether contract has enough funds to process this bet.
        // 检测合约是否有足够的资金支持此次赌注。
        require (jackpotSize + lockedInBets <= address(this).balance, "Cannot afford to lose this bet.");

        // Store bet parameters on blockchain.
        // 将投注的参数存储在区块链中。
        bet.amount = amount;
        bet.modulo = uint8(modulo);
        bet.rollUnder = uint8(rollUnder);
        bet.placeBlockNumber = uint40(block.number);
        bet.mask = uint40(mask);
        bet.gambler = msg.sender;
    }

    // Settlement transaction - can in theory be issued by anyone, but is designed to be handled by the dice2.win croupier bot. 
    // 结算交易--理论上可以被任何人发起，但是设计为只有dice2.win的管理员才才可以处理。
    // To settle a bet with a specific "commit", settleBet should supply a "reveal" number that would Keccak256-hash to "commit". 
    // 用一个特定的‘commit’来结算投注，结算投注需要提供一个‘reveal’数字。
    // clean_commit is some previously 'processed' bet, that will be moved into 'clean' state to prevent blockchain bloat and refund some gas.
    // ‘clean_commit’是一些先前被处理的投注，它们的状态会被置为‘chean’，以阻止区块链的膨胀，节约一些gas。
    function settleBet(uint reveal, uint cleanCommit) external {
        // "commit" for bet settlement can only be obtained by hashing a "reveal".
        // 用来投注结算的提交只能被‘reveal’的hash包含。
        uint commit = uint(keccak256(abi.encodePacked(reveal)));

        // Fetch bet parameters into local variables (to save gas).
        // 获取投注参数放入本地变量中。用来节约gas
        Bet storage bet = bets[commit];
        uint amount = bet.amount;
        uint modulo = bet.modulo;
        uint rollUnder = bet.rollUnder;
        uint placeBlockNumber = bet.placeBlockNumber;
        address gambler = bet.gambler;

        // Check that bet is in 'active' state.
        // 检验投注是否处在活跃状态。
        require (amount != 0, "Bet should be in an 'active' state");

        // Check that bet has not expired yet (see comment to BET_EXPIRATION_BLOCKS).
        // 检测投注是否过期
        require (block.number > placeBlockNumber, "settleBet in the same block as placeBet, or before.");
        require (block.number <= placeBlockNumber + BET_EXPIRATION_BLOCKS, "Blockhash can't be queried by EVM.");

        // Move bet into 'processed' state already.
        // 将投注移动到已处理的状态
        bet.amount = 0;

        // The RNG - combine "reveal" and blockhash of placeBet using Keccak256. 
        // Miners are not aware of "reveal" and cannot deduce it from "commit" (as Keccak256 preimage is intractable), and house is unable to alter the "reveal" after placeBet have been mined (as Keccak256 collision finding is also intractable).
        // RNG - 将‘reveal’和投注的hash使用Keccak256结合在一起。
        // 矿工对‘reveal’是无感的，并且不会从‘commit’中推断它。投注一旦被矿工记录后就不可以改变了。
        bytes32 entropy = keccak256(abi.encodePacked(reveal, blockhash(placeBlockNumber)));

        // Do a roll by taking a modulo of entropy. Compute winning amount.
        uint dice = uint(entropy) % modulo;

        uint diceWinAmount;
        uint _jackpotFee;
        (diceWinAmount, _jackpotFee) = getDiceWinAmount(amount, modulo, rollUnder);

        uint diceWin = 0;
        uint jackpotWin = 0;

        // Determine dice outcome.
        if (modulo <= MAX_MASK_MODULO) {
            // For small modulo games, check the outcome against a bit mask.
            if ((2 ** dice) & bet.mask != 0) {
                diceWin = diceWinAmount;
            }

        } else {
            // For larger modulos, check inclusion into half-open interval.
            if (dice < rollUnder) {
                diceWin = diceWinAmount;
            }

        }

        // Unlock the bet amount, regardless of the outcome.
        lockedInBets -= uint128(diceWinAmount);

        // Roll for a jackpot (if eligible).
        if (amount >= MIN_JACKPOT_BET) {
            // The second modulo, statistically independent from the "main" dice roll.
            // Effectively you are playing two games at once!
            uint jackpotRng = (uint(entropy) / modulo) % JACKPOT_MODULO;

            // Bingo!
            if (jackpotRng == 0) {
                jackpotWin = jackpotSize;
                jackpotSize = 0;
            }
        }

        // Log jackpot win.
        if (jackpotWin > 0) {
            emit JackpotPayment(gambler, jackpotWin);
        }

        // Send the funds to gambler.
        sendFunds(gambler, diceWin + jackpotWin == 0 ? 1 wei : diceWin + jackpotWin, diceWin);

        // Clear storage of some previous bet.
        if (cleanCommit == 0) {
            return;
        }

        clearProcessedBet(cleanCommit);
    }

    // Refund transaction - return the bet amount of a roll that was not processed in a due timeframe. 
    // 资金退回交易-退回没有在规定的时间内处理的交易金额。
    // Processing such blocks is not possible due to EVM limitations (see BET_EXPIRATION_BLOCKS comment above for details). 
    // 这类的交易区块由于EVM的限制，无法处理。
    // In case you ever find yourself in a situation like this, just contact the dice2.win support, however nothing precludes you from invoking this method yourself.
    // 在这种状态下，你会发现自己处在这样的状态中，
    function refundBet(uint commit) external {
        // Check that bet is in 'active' state.
        Bet storage bet = bets[commit];
        uint amount = bet.amount;

        require (amount != 0, "Bet should be in an 'active' state");

        // Check that bet has already expired.
        require (block.number > bet.placeBlockNumber + BET_EXPIRATION_BLOCKS, "Blockhash can't be queried by EVM.");

        // Move bet into 'processed' state, release funds.
        bet.amount = 0;

        uint diceWinAmount;
        uint jackpotFee;
        (diceWinAmount, jackpotFee) = getDiceWinAmount(amount, bet.modulo, bet.rollUnder);

        lockedInBets -= uint128(diceWinAmount);
        jackpotSize -= uint128(jackpotFee);

        // Send the refund.
        sendFunds(bet.gambler, amount, amount);
    }

    // A helper routine(常规、惯例) to bulk(大批) clean the storage.
    function clearStorage(uint[] cleanCommits) external {
        uint length = cleanCommits.length;

        for (uint i = 0; i < length; i++) {
            clearProcessedBet(cleanCommits[i]);
        }
    }

    // Helper routine to move 'processed' bets into 'clean' state.
    function clearProcessedBet(uint commit) private {
        Bet storage bet = bets[commit];

        // Do not overwrite active bets with zeros; additionally prevent cleanup of bets for which commit signatures may have not expired yet (see whitepaper for details).
        if (bet.amount != 0 || block.number <= bet.placeBlockNumber + BET_EXPIRATION_BLOCKS) {
            return;
        }

        // Zero out the remaining storage (amount was zeroed before, delete would consume 5k more gas).
        bet.modulo = 0;
        bet.rollUnder = 0;
        bet.placeBlockNumber = 0;
        bet.mask = 0;
        bet.gambler = address(0);
    }

    // Get the expected win amount after house edge is subtracted(扣除).
    function getDiceWinAmount(uint amount, uint modulo, uint rollUnder) private pure returns (uint winAmount, uint jackpotFee) {
        require (0 < rollUnder && rollUnder <= modulo, "Win probability out of range.");

        jackpotFee = amount >= MIN_JACKPOT_BET ? JACKPOT_FEE : 0;

        uint houseEdge = amount * HOUSE_EDGE_PERCENT / 100;

        if (houseEdge < HOUSE_EDGE_MINIMUM_AMOUNT) {
            houseEdge = HOUSE_EDGE_MINIMUM_AMOUNT;
        }

        require (houseEdge + jackpotFee <= amount, "Bet doesn't even cover house edge.");
        winAmount = (amount - houseEdge - jackpotFee) * modulo / rollUnder;
    }

    // Helper routine to process the payment.
    function sendFunds(address beneficiary, uint amount, uint successLogAmount) private {
        if (beneficiary.send(amount)) {
            emit Payment(beneficiary, successLogAmount);
        } else {
            emit FailedPayment(beneficiary, amount);
        }
    }

    // This are some constants making O(1) population count in placeBet possible.
    // See whitepaper for intuition and proofs behind it.
    uint constant POPCNT_MULT = 0x0000000000002000000000100000000008000000000400000000020000000001;
    uint constant POPCNT_MASK = 0x0001041041041041041041041041041041041041041041041041041041041041;
    uint constant POPCNT_MODULO = 0x3F;
}

// dice2.win picks a secret random number and provides you with its hash. 
// dice2.win 挑选了一个秘密的随机数，并且把它的hash提供给你。

// You send your bet in Ethereum transaction to our smart contract along with the hash from previous step.
// 将上一步骤中生成的hash和下注的数据一起通过以太坊交易的形式发送给智能合约。

// At this point dice2.win has already commited to a number, prior to you chosing an outcome.
// 

// Once your transaction is confirmed by the network, the contract stores the hash and bet details.

// Our croupier bot "reveals" the number by sending a bet settling transaction.

// The contract accepts the transaction if and only if the hash of provided number is the same as the stored one.

// The contract mixes the number and block hash of the bet transaction to get a random number.

// The contract decides whether you won or lost and sends you the winning amount of Ether.













