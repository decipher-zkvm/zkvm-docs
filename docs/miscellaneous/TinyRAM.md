# TinyRAM

TinyRAM is a RISC (Reduced Instruction Set Computer)-based RAM architecture designed to efficiently prove general-purpose programs within ZKP systems. In other words, TinyRAM introduces a simple instruction-based virtual machine that operates like a real computer, enabling efficient execution of programs written in high-level languages such as C or C++, and allowing the proving of their execution process. Through this, it can efficiently handle complex operations like loops and memory accesses, significantly reducing the circuit size and computational cost needed for proof generation. That is, TinyRAM converts the execution of complex programs into simple instruction traces, enabling proof systems to generate zero-knowledge proofs faster and with fewer resources.

![TinyRAM Architecture](./img/tinyRAM1.png)
*Source: [libsnark](https://github.com/scipr-lab/libsnark?ref=hackernoon.com)*

In other words, after compiling a C program into a TinyRAM program, a circuit generator creates a circuit, ultimately resulting in a zkSNARK circuit. This TinyRAM-based zk-SNARK system transforms the program's execution process into an arithmetic circuit, allowing it to prove via ZKP that the program was correctly executed on the given input.

![TinyRAM Execution Flow](./img/tinyRAM2.png)
*Source: [TinyRAM Paper](https://eprint.iacr.org/2013/507.pd)*

This diagram shows how the execution of a TinyRAM program is transformed into a form that can be proven in ZKP.

First, the TinyRAM assembly code—listing actual program instructions such as loops, conditionals, and memory accesses—is converted into a constraint satisfaction problem.

Each node represents the program's execution state (e.g., register values, memory state), and the arrows denote the state transitions caused by executing instructions. In other words, the logical constraints for verifying correct program execution are represented in the form of a network.

The rightmost diagram illustrates the process of converting this into an Arithmetic Circuit, where each constraint is mathematically expressed so that, given an actual input (assignment), it can be quickly verified whether all constraints are satisfied.

**Limitations**

While the TinyRAM architecture is more efficient than traditional circuit-based approaches, proof generation time can still become very long for real large-scale programs or complex computations—especially those involving frequent memory accesses. Additionally, since TinyRAM is designed for generality, it can be less efficient than specialized circuit approaches for certain operations (e.g., hash functions, cryptographic computations). Like zkDSL, there also exists the risk that insufficient constraints may allow incorrect executions to be proven.