# Real-Time Proving

Real-time proving means proving an Ethereum block within 12 seconds.

For example, Succinct’s SP1 Hypercube uses ZKPs running inside a zkVM to verify an Ethereum block within 12 seconds, just before the next block arrives. This process is called real-time proving because the proof is completed as quickly as Ethereum finalizes the block.

![Real-Time Proving Process](./img/realtime.png)
*Source: [Twitter](https://x.com/0xJuann/status/1929335910912663856)*

First, the block proposer collects unconfirmed transactions from the mempool. These transactions are sent to the zkVM built by Succinct Labs, where the zkVM executes the transactions using SP1. After execution, SP1 generates a succinct ZKP proving that the transactions are valid and correctly executed. This proof is broadcast to all Ethereum validators. Because the ZKP is very small and lightweight, Ethereum validators can verify it very quickly and finalize the block almost immediately.


## Why Real-Time Proving Is Important

To introduce ZKP on Ethereum L1, block validity proofs must be completed within the 12-second slot. When real-time proving becomes possible, the following advantages can be achieved:

- **100-1000x gas limit**: Regardless of the size of computation, verification can be completed within a fixed time, eliminating the need to maintain the currently limited gas limit.

- **Cross-rollup synchronous composability**: Real-time proving enables atomic composability between rollups.

- **More Secure light clients**: Currently, light clients only verify validator signatures but do not actually verify the validity of EVM state updates. With real-time proving, the integrity of state updates can be directly verified without needing to trust validators.

### Why Speed Alone Is Not Enough

Generating block proofs within 12 seconds can be called “real-time,” but if only a small number of operators can do it, it is meaningless. To introduce ZK on Ethereum L1, proof generation must be an essential part of the block proposal process. If real-time proving requires million-dollar equipment or proprietary stacks, Ethereum will quickly become centralized. Therefore, accessibility is just as important as speed.

## Significance

Originally, generating ZKPs for complex computations such as an entire Ethereum block consumed enormous resources and time, taking minutes or even hours. By shortening this time to less than 12 seconds, nodes only need to verify the ZKP without having to re-execute all transactions, thus reducing the computational workload. Additionally, faster proof generation enhances finality and improves the user experience.

In other words, once Real-Time Proving is achieved, Ethereum will be able to increase its scalability up to [**1 GigaGas(~10K TPS)**](https://x.com/drakefjustin/status/1924929057676001466) while maintaining its current level of decentralization.

However, it is still difficult to say that Real-Time Proving has been fully completed. For Ethereum’s full ZK integration, the following tasks must additionally be accomplished:

1. Thorough security audits (Formal Verification) of zkVM codes.

2. Optimization of proof generation speed to ensure proofs can be created within 12 seconds even in the worst-case scenarios (currently, zkVMs show about 12 seconds proof generation speed in typical cases).

Related:

* https://x.com/VitalikButerin/status/1925050155922862526


### What is Gigagas?

Gigagas is a way to measure how fast an Ethereum client can process transactions. Ethereum transactions consume “gas,” which is a unit representing the computational effort required to execute operations.

[Gigagas(GPS)](https://docs.surge.wtf/docs/about/gigagas) measures whether a client can process millions of gas units per second. For example, a client that processes **1 Gigagas per second** can handle transactions consuming 1 million gas units in one second.

Gigagas is important for evaluating the performance of rollups and execution clients. The higher the Gigagas performance, the faster the transaction processing speed, improved scalability, and reduced user costs.

![Gigagas Performance](./img/gigagas.png)
*Source: [Surge Documentation](https://docs.surge.wtf/docs/about/gigagas)*

Related:

* <figcaption><p><a href="https://x.com/drakefjustin/status/1920343548047569165">https://x.com/drakefjustin/status/1920343548047569165</a></p></figcaption>
* <figcaption><p><a href="https://www.paradigm.xyz/2024/04/reth-perf">https://www.paradigm.xyz/2024/04/reth-perf</a></p></figcaption>


## RTP Projects

* [SP1](/docs/parts-3-real-time-proving/sp1.md)
* [RISC Zero](/docs/parts-3-real-time-proving/Risc-zero.md)
* [Snarkify](/docs/parts-3-real-time-proving/Snarkify.md)
* [ZisK](/docs/miscellaneous/ZisK.md)
* [ZKsync](/docs/miscellaneous/zkSync.md)
