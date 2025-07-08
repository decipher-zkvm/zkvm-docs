---
sidebar_position: 3
---

# zkVM Landscape



awesome-zkvm 내용 참고해서 아래 그림처럼 만들기

<details>

<summary>Proof systems</summary>

* Arithmetization: The process of turning an execution trace into an algebraic statement (polynomial equations) that can be verified.
* Optimizations: Ingredients in the proof system that can optimize the size and complexity of the constraints overall.
* Backends: The proof system, typically in the form of a (Polynomial) Interactive Oracle Proof (IOP) and Polynomial Commitment Scheme (PCS), used for the (typically non-interactive) prover-verifier checks.
* Verifiers: Programs that can do the (typically non-interactive) verification given a proof and public inputs.

|                                zkVM                               |         Arithmetization         |                               Optimizations                              |                                  Backends                                 |    Verifiers   |
| :---------------------------------------------------------------: | :-----------------------------: | :----------------------------------------------------------------------: | :-----------------------------------------------------------------------: | :------------: |
|          [cairo](https://github.com/lambdaclass/cairo-vm)         |               AIR               |                                                                          |                                    FRI                                    |                |
|            [ceno](https://github.com/scroll-tech/ceno)            |               GKR               |                             Lookup, Sumcheck                             |                                 Brakedown                                 |      Rust      |
|      [eigen zkvm](https://github.com/0xEigenLabs/eigen-zkvm)      |               eAIR              |                                                                          |                                FRI, Groth16                               |    Solidity    |
|                [jolt](https://github.com/a16z/jolt)               |               R1CS              |                    Lookup, Sumcheck, Offline Mem Check                   |                                  Spartan                                  |      WASM      |
|        [miden](https://github.com/0xPolygonMiden/miden-vm)        |         AIR (winterfell)        |                                  Lookup,                                 |                                 Winterfell                                |      Rust      |
|          [mozak vm](https://github.com/0xmozak/mozak-vm)          |           AIR (Starky)          |                                  Lookup,                                 |                                    FRI                                    |      Rust      |
|          [nexus](https://github.com/nexus-xyz/nexus-zkvm)         | Folded Accumulated Relaxed R1CS |                            Accumulated Folding                           |                   Spartan + `{Zeromorph, PSE-Halo2 (KZG)}`                  |      Rust      |
| [o1vm](https://github.com/o1-labs/proof-systems/tree/master/o1vm) |             Plonkish            |                                  Lookup                                  |                                    IPA                                    |      Rust      |
|              [olavm](https://github.com/Sin7Y/olavm)              |          AIR (plonky2)          |                                  Lookup                                  |                                    FRI                                    |      Rust      |
|           [openvm](https://github.com/openvm-org/openvm)          |        AIR (plonky3), GKR       |                                                                          |                                    FRI                                    |      Rust      |
|           [pico](https://github.com/brevis-network/pico)          |          AIR (plonky3)          |                                  Lookup                                  |                                    FRI                                    | Rust, Solidity |
|           [powdrVM](https://github.com/powdr-labs/powdr)          |     AIR -ish (PIL, plonky3)     |                                     -                                    | PSE-Halo2 (KZG), Plonky3, FRI([eSTARK](https://eprint.iacr.org/2023/474)) |    Solidity    |
|              [risc0](https://github.com/risc0/risc0)              |              PLONK              |                                  Plookup                                 |           [DEEP-FRI & ALI](https://eprint.iacr.org/2021/582.pdf)          | Rust, Solidity |
|             [sp1](https://github.com/succinctlabs/sp1)            |          AIR (plonky3)          |                                  Lookup                                  |                                    FRI                                    | Rust, Solidity |
|        [sphinx](https://github.com/argumentcomputer/sphinx)       |     AIR (core), PLONK (wrap)    |                                  Lookup,                                 |                                    FRI                                    |      Rust      |
|         [triton vm](https://github.com/TritonVM/triton-vm)        |               AIR               | Lookup, [Contiguity](https://triton-vm.org/spec/memory-consistency.html) |                                    FRI                                    |      Rust      |
|       [valida](https://github.com/lita-xyz/valida-releases)       |          AIR (plonky3)          |                                                                          |                                    FRI                                    |        ?       |
|          [zisk](https://github.com/0xPolygonHermez/zisk)          |                ?                |                                     ?                                    |                                     ?                                     |        ?       |
|                [zkm](https://github.com/zkMIPS/zkm)               |          AIR (plonky2)          |                                  Lookup,                                 |                                    FRI                                    |      Rust      |
|          [zkWasm](https://github.com/DelphinusLab/zkWasm)         |              PLONK              |                                     -                                    |                                    IPA?                                   |      Rust      |

</details>

SP1 Turbo는 FRI

SP1 Hypercube는 jagged PCS



#### **예시**

*Source: [zkVM Comparison Document](https://assets.super.so/9c1ce0ba-bad4-4680-8c65-3a46532bf44a/files/a17715ac-e666-48ec-867c-3bb3087a107d.pdf)*