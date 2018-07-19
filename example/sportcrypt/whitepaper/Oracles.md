#7 Oracles

As mentioned in the introduction, SportCrypt currently implements a centralized oracle. Although some have argued that there is a path towards decentralized oracles, to us it is not yet clear whether these systems will work and, if so, when they will be trusted enough to rely upon.

正如在介绍里面提到的，SportCrypt目前实现了一种中心化的预言机制。尽管已经有些人已经提出了建立去中心化预言机制的途径，对我们来说，这样的系统是否工作良好，并且值得依赖暂时还不清楚。

The nice property of sporting events for prediction markets is that it is straightforward for honest parties to agree on the outcome of a match, either by watching the game themselves or by relying upon officially published scores. General prediction markets suffer from what we refer to as the “North Korean Missile Problem” (or the “Gore-Bush Election Problem”). On Intrade.com, there was a contract about whether North Korea would launch a missile during a certain time period. They did. This was widely reported and acknowledged as true by every expert in the field. However, the fine-print of the contract required this to be confirmed by a US government press release and there was never any press release issued. This left Intrade in the awkward position of choosing whether to violate their own posted contract rules, or to finalize a contract at a generally acknowledged as incorrect price.

体育赛事对于预测市场的优势在于它有良好的特性是它可以通过观看比赛或者官方通告达成一个明确的结果。一般的预测市场正遭受着“朝鲜导弹问题”或“戈尔布什选举问题”。在Intrage.com上，存在着一份关于朝鲜不会在特定时期不会发射导弹的合同。他们做到了。这得到了该领域的每位专家的报道和认可。然而相关的合同细则需要美国政府的确认，但是没有任何报道证明美国政府确认过此。这使得国际组织发展协会处于尴尬的境地，即选择是否违反他们自己公布的合同规则，或以公认的不正确价格确定合同。

The NK Missile Problem affects both centralized and distributed oracles, and the solution is not clear. With a centralized oracle, the oracle itself can unilaterally decide on the outcome, or it can defer to some other party. For instance, in the NK Missile example, Intrade deferred the decision to the US government. On the other hand, distributed oracles attempt to defer to the “wisdom of the crowds” in some manner, perhaps using economic incentives to encourage people to report what they believe to be true. However, in our view these systems remain theoretical and unproven.

朝鲜导弹问题影响了中心化和非中心化的预测，最终也没有明确的解决方案。在中心化的预测机制下，它本身可以单方面决定结果，或者将这个权利转移给其他的组织。例如，在朝鲜导弹问题里面，国际贸易发展组织将决定权交给了美国政府。另一方面，分布式的预测机制尝试将这种权利转化为利用人群的智慧，或许使用经济激励方式鼓励人们发布他们认为正确的想法。然而，在我们看来，这些系统仍然是理论的未经证实的。

In SportCrypt, we will attempt to build a reputation as a reliable oracle. If we mis- report events, users will have indisputable evidence of this because it is permanently embedded on the blockchain. Additionally, there is no way for us to report different outcomes to specific users: A mis-reported finalization price will affect every participant of the match.

在SportCrypt中，我们建立了一个可靠的预测体系。如果我们弄错了赛事信息，用户将会很容易获取到证据，因为这些信息都不可改变的存在于区块链上。另外，我们没有办法向不同的用户报告不同的结果：一个错误的最终价格将影响参与进来的每一个参与者。

That being said, should distributed oracles prove themselves to be reliable, punctual, and cost-effective, we are open to the possibility of integrating them into the SportCrypt platform.

话虽这么说，分布式预测系统应该能够证明他们自身是可靠的，准确的，低成本的，我们开放将它们整合到SportCrypt系统中的可能性。

Finally, due to the architecture of SportCrypt, it is possible for us to support “multi-sig” match finalization where two or more trusted oracles must agree upon a finalization price prior to the match being finalized. We will investigate this at a later date if the market demands higher oracle assurances.



