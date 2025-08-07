# Ethereum's ZK Scaling Journey

## What is EVM(Ethereum Virtual Machine)?

![EVM Diagram](./img/EVM.png)
*Source: [Ethereum.org](https://ethereum.org/en/developers/docs/evm/#:~:text=Diagram%20adapted%20from,a%20new%20tab)*

The Ethereum Virtual Machine (EVM) is a state-based execution environment that processes transactions and smart contracts within the Ethereum network. Every Ethereum node runs client software that implements the EVM specification—such as Geth, Nethermind, or Erigon—to participate in the network, ensuring consistent state transitions and block validation.

Transactions on Ethereum are represented as EVM bytecode, which consists of a low-level instruction set known as [opcodes](https://www.evm.codes/). The EVM executes this bytecode by performing stack-based operations, accessing memory, and manipulating persistent storage to update the blockchain state. This architecture allows smart contracts originally written in high-level languages like Solidity to be compiled into a standardized bytecode format that can be uniformly executed by all network nodes.

As a core component of Ethereum, the EVM guarantees that all nodes process transactions according to the same rules and synchronize their state accordingly. It thus serves as the foundational runtime for a wide range of decentralized applications(DApps). The full set of EVM instructions can be viewed in the EVM opcode documentation.


## What is zkEVM?

![zkEVM Overview](./img/zkEVM1.png)
*Source: [Chainlink Education Hub](https://chain.link/education-hub/zkevm)*

zkEVM is a system that generates validity proofs for smart contract execution results based on EVM bytecode, enabling on-chain verification that off-chain computations were performed correctly. The core technology underpinning zkEVM is ZKP, a cryptographic method that mathematically proves the correctness of computations without revealing underlying data.

ZK-Rollups utilizing zkEVM inherit the security model of Ethereum Layer 1(L1) because all state transitions occurring on the rollup are validated through cryptographically generated validity proofs. These proofs are verified by smart contracts on L1, mathematically guaranteeing that every transaction executed on Layer 2(L2) was processed accurately at the L1 level. This approach assures the legitimacy of L2 computation results without relying on L1 consensus and affords L2 users a security level comparable to the Ethereum mainnet.

In zk-Rollups, computations are executed off-chain on L2, with only succinct proofs and minimal accompanying data submitted on-chain to L1. This architectural separation allows L2 to be designed independently from L1 in terms of computation, enabling performance optimizations such as:

- Parallel processing architecture: Freed from the single-threaded EVM structure of L1, zkEVM can support parallel virtual machine execution.

- Adoption of ZK-friendly data structures: For example, using Poseidon-based commitments instead of traditional Merkle Trees.

- Opcode optimization or custom instruction introduction: Simplifying or removing EVM features that are inefficient for ZK proving, though such modifications may be limited if full EVM compatibility is to be preserved.


## Representative projects

![zkEVM Projects](./img/zkEVM3.png)

Several notable projects—such as [Polygon, zkSync, Scroll](https://x.com/jadler0/status/1549764211542315008), and Taiko—have aimed to develop the first zkEVM implementations, creating a competitive landscape in this emerging market. These projects share a common objective: to leverage ZK-SNARK technology to produce cryptographic proofs of transaction execution that closely resemble those on Ethereum. This approach either simplifies verification on the Ethereum chain itself or enables the construction of ZK rollups that offer significantly enhanced scalability while maintaining an environment nearly identical to Ethereum.


![zkEVM Landscape](./img/zkEVM4.png)
*Source: [Layer 2s and the zkEVM Landscape](https://medium.com/@johnnyantos/layer-2s-and-the-zkevm-landscape-strategic-implications-9d6a10158200)*


### Type-specific stages of zkEVM (Type 1-4)

Among these zkEVM implementations, there are subtle but important differences in factors such as EVM compatibility, proof generation speed, and development convenience. To balance practicality and performance, multiple zkEVM types have emerged, as categorized by [Vitalik Buterin](https://vitalik.eth.limo/general/2022/08/04/zkevm.html):

![zkEVM Types](./img/zkEVM2.png)
*Source: [Vitalik's Blog - The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)*

- Type 1: Fully identical to Ethereum’s environment at the proof level, enabling seamless use of existing infrastructure. However, proof generation time is very long, limiting practical scalability.

- Type 2: Almost identical to the EVM, with some external structures (e.g., state trees) modified to allow faster proof generation. It remains compatible with most Ethereum applications.

- Type 2.5: Adjusts certain parameters such as gas calculations to further accelerate proof generation. This may introduce minor incompatibilities but generally maintains broad compatibility.

- Type 3: Similar to the EVM but removes or simplifies certain features (such as precompiled contracts) to increase proof speed. Most applications remain compatible, though some modifications may be required.

- Type 4: Compiles high-level language code directly to a ZK-friendly virtual machine, resulting in the fastest proof generation. However, this approach significantly reduces compatibility with the existing Ethereum ecosystem.

In summary, there is a trade-off across these types: lower-numbered types offer higher Ethereum compatibility but slower proofs, whereas higher-numbered types provide better performance at the cost of compatibility with Ethereum’s existing infrastructure and applications. This spectrum allows projects to tailor their zkEVM implementations according to their priorities in compatibility versus scalability and speed.


## Inefficiencies of zkEVM

While zkEVM provides high compatibility with the Ethereum Virtual Machine (EVM), it requires converting every EVM operation (opcode) into a form that can be proven via ZKP. This results in highly complex proof circuits, causing performance degradation. Although some projects have improved proof generation speed through approaches like Type 2.5, the inherent inefficiencies and ZK-unfriendliness of the EVM remain unresolved. In other words, the EVM is a highly inefficient Instruction Set Architecture(ISA) for ZK proving.

**Stack-Based Architecture**


The EVM is designed as a 256-bit stack machine, which is not hardware-friendly and necessitates multiple opcode steps even for simple operations. All computations are performed via the stack, with each opcode directly depending on the result of the previous one. Moreover, the stack resides in memory rather than CPU registers, and memory access is tens to hundreds of times slower than register operations. This increased memory access frequency can cause bottlenecks. The limited opcode set combined with 256-bit arithmetic circuits makes implementing complex logic challenging.

**Opcode Complexity**

The EVM currently comprises over 140 opcodes, and with every new Ethereum Improvement Proposal(EIP), additional opcodes are introduced. Each new opcode requires redesigning the zk-circuit, complicating maintenance and development.

**Proving Costs & Storage Overhead**

Hash functions such as Keccak-256 require separate circuit designs for each use, and due to their high circuit costs compared to ZK-friendly hashes like Poseidon, they are ill-suited for ZKP. This further adds to the proving costs and storage overhead, making the EVM structure less efficient for ZKP systems.