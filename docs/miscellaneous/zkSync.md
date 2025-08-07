# ZKsync

* X: [https://x.com/zksync/status/1937587716453204009](https://x.com/zksync/status/1937587716453204009)

* blog: [https://zksync.mirror.xyz/ZgRmbYA_EE3wfGcXWv81m-xcED-ppNKkRzkleS6YZRc](https://zksync.mirror.xyz/ZgRmbYA_EE3wfGcXWv81m-xcED-ppNKkRzkleS6YZRc)


**Airbender** is ZKsync's new zkVM and proving system designed to generate ZKPs for the execution of RISC-V bytecode. It is built together with ZKsync OS, a modular operating system for the ZKsync chain, and designed to support various execution environments including EVM, EraVM, and WASM.

The core proving engine is based on **AIR constraints** compiled into highly optimized DEEP STARK proofs over the Mersenne31 prime field. It supports custom machine configurations, precompiled circuits (e.g., Blake2s/Blake3, big-integer arithmetic), and recursive proving modes.

Airbender is a high-performance universal ZK prover designed to meet the practical demands of interoperability, decentralization, and scalability without compromise. Airbender is the fastest open-source RISC-V zkVM.

[Mersenne31_polynomial_arithmetic.pdf](https://github.com/ingonyama-zk/papers/blob/main/Mersenne31_polynomial_arithmetic.pdf)

### Proving Architecture

- **Witness Commitment:** alculation of Low-Degree Extensions (LDEs) and trace commitments

- **Lookup & Memory Argument:** Verification of memory operations using lookup tables

- **STARK Quotient Polynomial:** Encoding circuit constraints via AIR polynomials

- **DEEP Polynomial Construction:** Implementation of FRI batching to reduce proof size

- **FRI IOPP:** Generation of the final proximity proof


### Benchmarks

Airbender was benchmarked against two major zkVM proving systems, RiscZero and SP1(Turbo), using a standardized Fibonacci program for a fair comparison. The benchmarks were conducted on both NVIDIA L4 and H100 GPUs, measuring performance in two stages:


- **Base Proving:** Proof generation in the first round

- **STARK Recursion:** Subsequent rounds aggregating base proofs into a single or a few final proofs

![Airbender Performance Benchmarks](./img/zksync1.png)
*Source: [zkSync Mirror](https://zksync.mirror.xyz/ZgRmbYA_EE3wfGcXWv81m-xcED-ppNKkRzkleS6YZRc)*

![Airbender vs Competitors](./img/zksync2.png)


Airbender is the fastest Base Layer Prover on both powerful ([H100](https://www.nvidia.com/en-us/data-center/h100/)) GPUs and small, economical ([L4](https://www.nvidia.com/en-us/data-center/l4/)) GPUs. It proves at 21.8 MHz (millions of cycles proven per second) on the H100, compared to 3.45 MHz for SP1 Turbo and 1.1 MHz for RiscZero.

Airbender is also the fastest in end-to-end proofs including recursion, achieving 8.5 million cycles per second, which is 2.5–4 times faster than SP1 Turbo and 8.5–11 times faster than RiscZero.

**Near Real-time Ethereum Proofs on a Single GPU**

Using ZKsync Airbender and [ZKsync OS](https://github.com/matter-labs/zksync-os) (our new EVM execution environment), it is possible to prove an average Ethereum block with a **single H100 GPU** at an average speed of under 35 seconds. Without recursion, an Ethereum block can be proven in 17 seconds, demonstrating that **Real-Time Proving** is achievable on a single GPU.

SP1 Hypercube took about 12 seconds to prove an Ethereum block but required 50 to 160 GPUs (Nvidia 4090, roughly equivalent to an H100) to do so.