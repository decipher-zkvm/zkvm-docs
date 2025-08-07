# EOF(EVM Object Format)

EOF introduces an extensible and versioned container format to EVM bytecode, designed to allow code to be verified only once at the time of smart contract deployment. This aims to separate code and data, strengthen code verification, and improve overall execution efficiency. EOF consists of a series of EIPs and intends to structurally enhance the Ethereum execution environment (see EIP-7692 for reference).

![EOF Overview](./img/EOF.png)
*Source: [Ethereum Object Format (EOF): A Comprehensive Guide](https://medium.com/@ankitacode11/ethereum-object-format-eof-a-comprehensive-guide-3431ae9a05de)*

In particular, EOF offers benefits such as simplifying compilers and static analysis, reducing bytecode size and improving performance, easing EVM upgrades, and enhancing zk-friendliness.

However, adopting EOF adds complexity because existing compilers, debuggers, and other tools that handle EVM bytecode must be adapted to the EOF format. This added complexity recently led to the discovery and fixing of bugs related to reentrancy attacks. In other words, due to the excessive combination of features, almost all libraries need to be rewritten, which incurs high costs. Therefore, the sentiment seems to be that the benefits do not sufficiently outweigh the added complexity.