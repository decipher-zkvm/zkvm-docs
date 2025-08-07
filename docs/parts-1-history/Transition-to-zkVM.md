# Transition to zkVM

Due to the constraint of maintaining compatibility with Ethereum, zkEVM must encompass the entire complex EVM architecture within its proof scope, resulting in low efficiency in proof generation and challenging maintenance. As these limitations became more pronounced, starting around 2023, various projects such as RISC Zero, Jolt, and ZKM began gaining attention by proposing zkVMs (Zero-Knowledge Virtual Machines) based on general-purpose instruction set architectures (ISAs) like RISC-V and MIPS. zkVMs can generate zero-knowledge proofs for arbitrary programs written in general-purpose programming languages such as Rust, C++, and Go, and as independent computation proof engines not tied to any specific blockchain, they offer scalability and applicability across diverse environments.

![VM Evolution](./img/zkVM3.png)
*Source: [zkVM: New Paradigm for Web3 Computing](https://4pillars.io/en/issues/zkvm-new-paradigm-for-web3-computing#:~:text=2.1%20From%20Traditional%20VMs%20to%20zkVMs)*

## What is zkVM?

zkVM (Zero-Knowledge Virtual Machine) is a virtual machine that operates independently of any specific blockchain and uses ZKP technology to guarantee the integrity of arbitrary program execution, and in some cases, privacy as well. Unlike zkEVM, which is optimized to prove execution of Ethereum bytecode, zkVM is designed based on general-purpose instruction set architectures(ISAs) such as RISC-V or MIPS. This design enables zkVM to function as a versatile zero-knowledge computation proof engine applicable across diverse computing environments.

In zkVM, a prover can generate a zero-knowledge proof demonstrating that “I have executed this code correctly and the result is valid.” The verifier can then confirm that the calculation was performed correctly without learning any actual computed values or internal logic. This process protects sensitive information by ensuring that no details of the computation are exposed, thus maintaining privacy and security.


![zkVM Process Flow](./img/zkVM4.png)
*Source: [Zero Knowledge Paradigm: zkVM](https://www.lita.foundation/blog/zero-knowledge-paradigm-zkvm#:~:text=An%20abstracted%2C%20generalized%20process%20flowchart%20of%20a%20zkVM%2C%20split%20and%20categorized%20between%20the%20format%20(inputs%20/%20outputs)%20of%20a%20program.)*


## How zkVM Works


Developers write code in common programming languages such as Rust, C++, or Go, then compile it into bytecode targeting a specific instruction set architecture (ISA), like RISC-V, using compilers such as LLVM. The zkVM system then generates a proof of the execution of this ISA-based bytecode by modeling the behavior of an emulator running the code.

During execution, the virtual machine(VM) produces an execution trace that records every state transition — including which instructions were executed at each step and how the values in registers and memory changed over time.

The prover transforms this execution trace into a mathematical representation, typically using polynomials, and constructs a zero-knowledge proof (ZKP) that certifies the computation was carried out faithfully according to the ISA specification. This process essentially allows the prover to cryptographically demonstrate, "I executed this code correctly, and the output is valid," without revealing any underlying data.

The verifier then confirms the correctness of the result solely by validating the submitted proof, without rerunning the code. Because inputs, outputs, and intermediate states remain confidential throughout, zkVM ensures integrity verification while preserving privacy.