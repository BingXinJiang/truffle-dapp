pragma solidity ^0.4.19;

import './SafeMath.sol';
import './oraclizeLib.sol';

//contract DogRace is usingOraclize {
contract DogRace {
    using SafeMath for uint256; 

    string public constant version = "0.0.4";

    uint public constant min_bet = 0.1 ether;
    uint public constant max_bet = 1 ether;
    uint public constant house_fee_pct = 5;
    uint public constant claim_period = 30 days;

    address public owner;   // owner address

    // Currencies: BTC, ETH, LTC, BCH, XRP
    uint8 constant dogs_count = 5;

    // Race states and timing
    struct chronus_struct {
        bool  betting_open;     // boolean: check if betting is open
        bool  race_start;       // boolean: check if race has started
        bool  race_end;         // boolean: check if race has ended
        bool  race_voided;      // boolean: check if race has been voided
        uint  starting_time;    // timestamp of when the race starts
        uint  betting_duration; // duration of betting period
        uint  race_duration;    // duration of the race
    }
    
    // Single bet information
    struct bet_info {
        uint8 dog;       // Dog on which the bet is made
        uint amount;    // Amount of the bet
    }

    // Dog pool information
    struct pool_info {
        uint bets_total;       // total bets amount
        uint pre;              // start price
        uint post;             // ending price
        int delta;             // price delta
        bool post_check;       // differentiating pre and post prices in oraclize callback
        bool winner;           // has respective dog won the race?
    }

    // Bettor information
    struct bettor_info {
        uint bets_total;       // total bets amount
        bool rewarded;         // if reward was paid to the bettor
        bet_info[] bets;       // array of bets
    }

    mapping (bytes32 => uint) oraclize_query_ids;        // mapping oraclize query IDs => dogs
    mapping (address => bettor_info) bettors;       // mapping bettor address => bettor information
    
    pool_info[dogs_count] pools;                    // pools for each currency

    chronus_struct chronus;                         // states and timing

    uint public bets_total = 0;                     // total amount of bets
    uint public reward_total = 0;                   // total amount to be distributed among winners
    uint public winning_bets_total = 0;             // total amount of bets in winning pool(s)
    uint prices_remaining = dogs_count;             // variable to check if all prices are received at the end of the race
    int max_delta = int256((uint256(1) << 255));    // winner dog(s) delta; initialize to minimal int value

    // tracking events
    event OraclizeQuery(string description);
    event PriceTicker(uint dog, uint price);
    event Bet(address from, uint256 _value, uint dog);
    event Reward(address to, uint256 _value);
    event CheckPoint(string what);

    // constructor
    function DogRace() public {
        owner = msg.sender;
        oraclizeLib.oraclize_setCustomGasPrice(20000000000 wei); // 20GWei
    }

    // modifiers for restricting access to methods
    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    modifier duringBetting {
        require(chronus.betting_open);
        _;
    }
    
    modifier beforeBetting {
        require(!chronus.betting_open && !chronus.race_start);
        _;
    }

    modifier afterRace {
        require(chronus.race_end);
        _;
    }

    // ======== Bettor interface ===============================================================================================

    // place a bet
    function place_bet(uint8 dog) external duringBetting payable  {
        require(msg.value >= min_bet && msg.value <= max_bet && dog < dogs_count);

        bet_info memory current_bet;

        // Update bettors info
        current_bet.amount = msg.value;
        current_bet.dog = dog;
        bettors[msg.sender].bets.push(current_bet);
        bettors[msg.sender].bets_total = bettors[msg.sender].bets_total.add(msg.value);

        // Update pools info
        pools[dog].bets_total = pools[dog].bets_total.add(msg.value);

        bets_total = bets_total.add(msg.value);

        Bet(msg.sender, msg.value, dog);
    }

    // fallback method for accepting payments
    function () private payable {}

    // method to check the reward amount
    function check_reward() afterRace external constant returns (uint) {
        return bettor_reward(msg.sender);
    }

    // method to claim the reward
    function claim_reward() afterRace external {
        require(!bettors[msg.sender].rewarded);
        
        uint reward = bettor_reward(msg.sender);
        require(reward > 0 && this.balance >= reward);
        
        bettors[msg.sender].rewarded = true;
        msg.sender.transfer(reward);

        Reward(msg.sender, reward);
    }

    // ============================================================================================================================

    //oraclize callback method
    function __callback(bytes32 myid, string result) public {
        require (msg.sender == oraclizeLib.oraclize_cbAddress());

        chronus.race_start = true;
        chronus.betting_open = false;
        uint dog_index = oraclize_query_ids[myid];
        require(dog_index > 0);                 // Check if the query id is known
        dog_index--;
        oraclize_query_ids[myid] = 0;                // Prevent duplicate callbacks

        if (!pools[dog_index].post_check) {
            pools[dog_index].pre = oraclizeLib.parseInt(result, 3); // from Oraclize
            pools[dog_index].post_check = true;        // next check for the coin will be ending price check

            PriceTicker(dog_index, pools[dog_index].pre);
        } else {
            pools[dog_index].post = oraclizeLib.parseInt(result, 3); // from Oraclize
            // calculating the difference in price with a precision of 5 digits
            pools[dog_index].delta = int(pools[dog_index].post - pools[dog_index].pre) * 10000 / int(pools[dog_index].pre);
            if (max_delta < pools[dog_index].delta) {
                max_delta = pools[dog_index].delta;
            }
            
            PriceTicker(dog_index, pools[dog_index].post);
            
            prices_remaining--;                    // How many end prices are to be received
            if (prices_remaining == 0) {           // If all end prices have been received, then process rewards
                end_race();
            }
        }
    }

    // calculate bettor's reward
    function bettor_reward(address candidate) internal afterRace constant returns(uint reward) {
        bettor_info storage bettor = bettors[candidate];

        if (chronus.race_voided) {
            reward = bettor.bets_total;
        } else {
            if (reward_total == 0) {
                return 0;
            }
            uint winning_bets = 0;
            for (uint i = 0; i < bettor.bets.length; i++) {
                if (pools[bettor.bets[i].dog].winner) {
                    winning_bets = winning_bets.add(bettor.bets[i].amount);
                }
            }
            reward = reward_total.mul(winning_bets).div(winning_bets_total);
        }
    }

    // ============= DApp interface ==============================================================================================

    // exposing pool details for DApp
    function get_pool(uint dog) external constant returns (uint, uint, uint, int, bool, bool) {
        return (pools[dog].bets_total, pools[dog].pre, pools[dog].post, pools[dog].delta, pools[dog].post_check, pools[dog].winner);
    }

    // exposing chronus for DApp
    function get_chronus() external constant returns (bool, bool, bool, bool, uint, uint, uint) {
        return (chronus.betting_open, chronus.race_start, chronus.race_end, chronus.race_voided, chronus.starting_time, chronus.betting_duration, chronus.race_duration);
    }

    // exposing bettor info for DApp
    function get_bettor_nfo() external constant returns (uint, uint, bool) {
        bettor_info info = bettors[msg.sender];
        return (info.bets_total, info.bets.length, info.rewarded);
    }

    // exposing bets info for DApp
    function get_bet_nfo(uint bet_num) external constant returns (uint, uint) {
        bettor_info info = bettors[msg.sender];
        bet_info b_info = info.bets[bet_num];
        return (b_info.dog, b_info.amount);
    }

    // =========== race lifecycle management functions ================================================================================

    // place the oraclize queries and open betting
    function setup_race(uint betting_period, uint racing_period) public onlyOwner beforeBetting payable returns(bool) {
        // We have to send 2 queries for each dog; check if we have enough ether for this
        require (oraclizeLib.oraclize_getPrice("URL", 500000) * 2 * dogs_count < this.balance);

        chronus.starting_time = block.timestamp;
        chronus.betting_open = true;
        
        uint delay = betting_period.add(60); //slack time 1 minute
        chronus.betting_duration = delay;

        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/bitcoin/).0.price_usd", 500000)] = 1;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/ethereum/).0.price_usd", 500000)] = 2;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/litecoin/).0.price_usd", 500000)] = 3;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/).0.price_usd", 500000)] = 4;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/ripple/).0.price_usd", 500000)] = 5;

        delay = delay.add(racing_period);

        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/bitcoin/).0.price_usd", 500000)] = 1;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/ethereum/).0.price_usd", 500000)] = 2;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/litecoin/).0.price_usd", 500000)] = 3;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/).0.price_usd", 500000)] = 4;
        oraclize_query_ids[oraclizeLib.oraclize_query(delay, "URL", "json(https://api.coinmarketcap.com/v1/ticker/ripple/).0.price_usd", 500000)] = 5;

        OraclizeQuery("Oraclize queries were sent");
        
        chronus.race_duration = delay;

        return true;
    }

    // end race and transfer house fee (called internally by callback)
    function end_race() internal {

        chronus.race_end = true;

        // calculate winning pool(s) and their total amount
        for (uint dog = 0; dog < dogs_count; dog++) {
            if (pools[dog].delta == max_delta) {
                pools[dog].winner = true;
                winning_bets_total = winning_bets_total.add(pools[dog].bets_total);
            }
        }

        // calculate house fee and transfer it to contract owner
        uint house_fee;

        if (winning_bets_total == 0) {              // No winners => house takes all the money
            reward_total = 0;
            house_fee = this.balance;
        } else {
            if (winning_bets_total == bets_total) {     // All the bettors are winners => void the race => no house fee; everyone gets their bets back
                chronus.race_voided = true;
                house_fee = 0;
            } else {
                house_fee = bets_total.mul(house_fee_pct).div(100);         // calculate house fee as % of total bets
            }
            reward_total = bets_total.sub(house_fee);                   // subtract house_fee from total reward
            house_fee = this.balance - reward_total;                    // this.balance will also include remains of kickcstart ether
        }

        owner.transfer(house_fee);
    }

    // in case of any errors in race, enable full refund for the bettors to claim
    function void_race() external onlyOwner {
        require(now > chronus.starting_time + chronus.race_duration);
        require((chronus.betting_open && !chronus.race_start)
            || (chronus.race_start && !chronus.race_end));
        chronus.betting_open = false;
        chronus.race_voided = true;
        chronus.race_end = true;
    }

    // method to retrieve unclaimed winnings after claim period has ended
    function recover_unclaimed_bets() external onlyOwner {
        require(now > chronus.starting_time + chronus.race_duration + claim_period);
        require(chronus.race_end);
        owner.transfer(this.balance);
    }

    // selfdestruct (returns balance to the owner)
    function kill() external onlyOwner {
        selfdestruct(msg.sender);
    }
}
