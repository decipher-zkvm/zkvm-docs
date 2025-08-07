# ZK-based Scaling: Unlocking Blockchain's Potential

## Motivation of ZK-based Scaling

Blockchain technology has revolutionized distributed ledger systems, but its requirement that every transaction must be verified and stored by every network node imposes inherent scalability constraints. As the network expands, this architecture leads to performance bottlenecks: because each node must process all transactions to maintain global consensus, the system suffers from limited transactions per second (TPS) and cannot easily leverage parallel processing. When user demand surges, block size limits and processing throughput become critical bottlenecks, resulting in transaction delays and increased gas fees as the network grows congested. These structural limitations create significant obstacles for the adoption of blockchain in high-performance, large-scale applications.

Zero-Knowledge Proofs (ZKPs) offer a fundamentally innovative approach to overcoming blockchain’s scalability challenges. By allowing computationally intensive tasks to be executed off-chain by a specialized prover, the network only needs to validate a succinct cryptographic proof—such as a ZK-SNARK or ZK-STARK—rather than each individual transaction or state transition. For instance, a prover can aggregate thousands of transactions or process complex smart contract logic off-chain and generate a concise proof that attests to the correctness of the entire computation. On-chain, validators simply verify the proof, enabling the network to ensure the validity of large batches of operations without re-executing them.

ZKP-based scaling solutions deliver the following enhancements to blockchain network efficiency:

- The volume of data and computation performed on-chain is significantly reduced, increasing the number of transactions that can be processed in each block. This allows more user transactions to be included per block without compromising network performance.

- Mainnet validators are required only to verify the validity of ZK proofs, not to re-execute each transaction or state transition individually. This leads to a predictable, stable cost for validation and significantly lowers the overall computational burden on the network.

By eliminating the computational bottleneck on the main chain and cleanly separating off-chain computation from on-chain verification, ZKP-based scaling enables the design of efficient, highly scalable blockchain architectures suitable for demanding, real-world applications.


## Early ZK Implementations

The practical adoption of ZK technology began with the mainnet launch of [Zcash](https://z.cash/) in 2016. Zcash utilized the [libsnark](https://github.com/scipr-lab/libsnark) library to practically implement zk-SNARKs, enabling privacy-focused blockchain transactions that prove the validity of transactions while fully encrypting transaction details.

However, early ZK applications were very difficult to develop because they required direct use of low-level libraries such as libsnark. To overcome this, zkDSLs were introduced.


### zkDSL(Zero-Knowledge Domain Specific Language)
![zkDSL Overview](./img/zkdsl.png)
*Source: [OLA zkVM: A Programmable Privacy Platform for Ethereum](https://medium.com/@ola_zkzkvm/a-programmable-privacy-platform-for-ethereum-understanding-olas-design-principles-and-technical-8a47ff07e725)*


zkDSL is a domain-specific language designed to efficiently design and write ZKP circuits (zk-circuits). Developers can design complex cryptographic circuits using high-level programming languages, and programs written in this language are converted into arithmetic circuits to be used in proof systems. Representative zkDSLs include Circom, Noir, Leo, and Halo2.

zkDSLs have performance limitations, such as rapid increases in circuit size and proof generation time for complex computations. Testing and debugging ZK circuits is difficult—especially input/witness generation, partial circuit testing, and performance optimization are complex. Support varies by DSL, and there are compatibility issues due to the lack of standardized intermediate representations (IR). Furthermore, insufficient constraints can cause security vulnerabilities, and zkDSLs have limited expressiveness and smaller library ecosystems compared to high-level languages, which creates practical limitations.


## Overview of zkEVM vs zkVM debate

As Zero-Knowledge technology has become a cornerstone for blockchain scalability, various implementation approaches have emerged. Among them, two primary paradigms stand out based on differing technical philosophies and objectives: zkEVM, which prioritizes EVM compatibility, and zkVM, which emphasizes general-purpose functionality and optimization.

### zkEVM

zkEVM constructs zk-circuits that faithfully model every operation performed within the Ethereum Virtual Machine. It cryptographically proves that transaction execution on Ethereum is correct by representing smart contract bytecode execution, stack and memory state changes, storage accesses, and gas consumption within verifiable circuits. This design allows existing Solidity smart contracts to run unmodified within a ZK environment, maintaining full interoperability with the Ethereum ecosystem.

However, the EVM architecture was not originally designed for Zero-Knowledge proof systems, presenting several obstacles. Its stack-based execution model, irregular and complex instruction set, and gas accounting mechanisms complicate the construction of efficient zk-circuits, resulting in larger circuit sizes and longer proof generation times. Furthermore, the ongoing evolution of the EVM specification—driven by Ethereum Improvement Proposals(EIPs)—requires frequent updates and revalidation of zk-circuits, increasing maintenance complexity and cost. These factors impose technical challenges on zkEVM development teams and constrain rollup throughput and proof efficiency.


### zkVM

In contrast, zkVM is a blockchain-agnostic, general-purpose execution environment based on a simple instruction set architecture (ISA) such as RISC-V. It compiles programs written in widely-used high-level languages like Rust, C, or Go into zk-circuits, enabling the generation of succinct proofs of correct execution without dependency on any particular blockchain or virtual machine.

By adopting a streamlined ISA, zkVM simplifies circuit design, reduces proof generation time, and minimizes circuit complexity. This architectural simplicity facilitates technical scalability advantages, including parallel proof generation, hardware acceleration, and support for multiple programming languages. However, zkVM lacks native compatibility with the EVM, necessitating translation or emulation layers to execute existing Solidity-based decentralized applications. Despite this, zkVM’s architecture mitigates maintenance burdens inherent in EVM compatibility and broadens the potential for ZK applications across diverse blockchain platforms and developer ecosystems.


## ZK-Rollup

The emergence of first-generation ZK Rollups marked a significant turning point in recognizing Zero-Knowledge (ZK) technology as a key solution to blockchain scalability challenges. Early ZK Rollup projects such as Loopring and zkSync Lite aimed to reduce the processing burden on the Ethereum mainchain by executing transactions off-chain and submitting only the resulting state along with a ZK proof on-chain. This architecture preserved data integrity and security while substantially lowering the costs associated with on-chain computation and data storage.

However, these initial ZK Rollups focused primarily on simple token transfers and swaps, lacking support for executing smart contracts at the level of the EVM. This limitation was due to the technical challenges in circuit design and proof generation capabilities at the time.

Subsequent advancements in circuit optimization, prover architecture, and the development of high-performance proving systems led to the introduction of zkEVM-based Rollups that support full smart contract execution. Prominent examples include zkSync Era, Polygon zkEVM, Scroll, and StarkNet. These platforms either replicate EVM bytecode execution within ZK circuits or utilize proprietary VM architectures to enable proof generation for smart contract executions.

In parallel, zkVM was developed as an effort to implement ZK technology in a more generalized environment without dependence on the EVM. Built upon ZK-friendly instruction sets such as RISC-V, zkVM constructs proof circuits that facilitate efficient ZK execution beyond EVM-based systems. This approach broadens the applicability of Zero-Knowledge technology across various blockchains and general computing environments, enhancing its potential reach and utility.