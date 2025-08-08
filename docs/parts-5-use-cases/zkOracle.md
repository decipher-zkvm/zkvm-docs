# zkOracle

With the introduction of zkVM technology into the blockchain ecosystem, one notable application is the zkOracle. A zkOracle is a framework designed to ensure the integrity of oracle data in a trust-minimized way, addressing the limitations of traditional multisig or centralized data aggregation methods.

A concrete example is Lido, a protocol aimed at solving Ethereum’s staking liquidity problem. Lido has integrated a zkOracle built on Succinct Labs’ SP1 zkVM to improve its staking data aggregation process, which previously relied on a multisig oracle. This transition aims to achieve a more trust-minimized architecture. This section examines how Lido leverages zkVM technology and the resulting improvements in security and efficiency.

## Overview of the Lido Project
Lido is a decentralized liquid staking protocol for PoS blockchains such as Ethereum. Users deposit assets like ETH into Lido to earn staking rewards while receiving liquid staking tokens—such as stETH—that can be freely used in DeFi. By issuing these derivative tokens, Lido solves the lock-up problem of staked assets, enabling more users to participate in staking with ease.

The Lido Oracle module is responsible for delivering Ethereum consensus layer (Beacon Chain) data to Lido’s smart contracts. Currently, this module depends on a third-party oracle committee composed of nine members, with data updates approved by a 5-of-9 multisig scheme. At regular intervals, this committee aggregates key consensus data—such as the total staked ETH across all Lido validators, the number of newly activated or exited validators—and submits it to the AccountingOracle contract. This information is critical for core operations such as adjusting the supply of stETH.

However, in this structure, data accuracy depends heavily on the integrity of the oracle operators. Any malicious manipulation or error could compromise protocol safety. To reduce this centralized trust dependency, the Lido community began exploring cryptographic, zero-knowledge proof–based alternatives. One such proposal, from the Succinct Labs team, is the deployment of an SP1 zkVM–based Lido zkOracle.

## How Lido Uses SP1 zkVM: zkOracle Implementation
![](img/lido(1).png)
*Source: [Succinct X](https://x.com/SuccinctLabs/status/1854959099030782159)*

Lido uses SP1 to build a zkOracle that verifies Ethereum consensus layer data. The core role of the Lido zkOracle is to recreate and validate Lido-related information from the Ethereum Beacon Chain in a trustless manner on-chain. The overall flow works as follows:

- **Data Collection**: The oracle client fetches state data from the Beacon Chain. It also retrieves summary information from the previous accounting report—such as the slot number and cumulative staking balance—from either contract storage or parameters. All of this data is packaged into a public struct and serialized into binary input suitable for the SP1 program.
- **Program Execution and Proof Request**: Using the prepared input data, the oracle client requests proof generation from the Succinct SP1 network. Two execution modes are available:
    - Local Mode: Runs the SP1 prover locally in a Docker environment to execute the program and generate the proof.
    - Network Mode: Sends the job to Succinct’s distributed prover network.
- **Receiving Output and Proof**: Once the SP1 program executes, it produces both the output data and a ZKP proving the correctness of execution. The oracle client receives these from the SP1 network and prepares them for on-chain submission.

In short, Lido’s SP1 zkOracle processes Ethereum consensus data about Lido’s validators using a Rust-based program, generates a proof of correct execution via SP1 zkVM, and enables the on-chain contract to accept the result without relying on trusted third parties.

Lido has successfully demonstrated proof generation and on-chain verification for validator datasets exceeding one million entries on the Goerli and Holesky testnets. The official launch is planned for later this year.

## Expected Benefits of Integrating SP1 zkOracle
**Enhanced Security and Trust Minimization**: 
The primary benefit of the zkOracle is its fundamental improvement of the protocol’s trust model. The system no longer relies solely on the honesty of oracle signers, greatly reducing the risk of data manipulation or operator error.

**Increased Transparency**: 
A zk proof provides a publicly verifiable mathematical guarantee of correctness. The community can independently validate the provided proof to confirm the integrity of results.

**Phased Deployment with Redundancy**: 
Instead of fully replacing the existing oracle system, zkOracle is introduced in parallel, adding redundancy. This ensures that if one system encounters bugs or failures, the overall service impact remains limited.

By integrating the SP1 zkOracle, Lido adds a cryptographic proof–based verification layer to its core data pipeline. This significantly reduces oracle-related risks and is expected to improve the protocol’s long-term stability and decentralization.