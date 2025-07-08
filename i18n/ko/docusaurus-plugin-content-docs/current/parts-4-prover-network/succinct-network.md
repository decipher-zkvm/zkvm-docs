# Succinct Network

[Succinct Network whitepaper](https://pdf.succinct.xyz/)

![](img/succinct.png)

Succinct Network is co-designed with SP1 to exponentially expand global proof generation capacity, introducing the concept of a global, distributed proving cluster powered by a competitive auction mechanism called "proof contests."

1. **A global, distributed proving cluster:**
   * The network provides a unified platform where users submit proof requests, and anyone in the world can contribute proving capacity.
   * Provers participate permissionlessly by simply running the node software.
2. **Proof contests:**
   * The "proof contests" mechanism is a new form of auction that drives free-market competition while balancing proving costs and decentralization.
   * It is an all-pay auction that utilizes collateral.

### SP1 (zkVM)

[SP1 technical paper](https://drive.google.com/file/d/1aTCELr2b2Kc1NS-wZ0YYLKdw1Y2HcLTr/view)

![](img/sp1.png)

* **SP1** is a zero-knowledge virtual machine (zkVM) developed and maintained by **Succinct**.
* It proves the correctness of **RISC-V** programs using **STARK** proofs, ensuring that any claimed outputs truly match the program's execution on given inputs.

#### Architecture & Key Components

* **Multiple Chips (CPU, ALU, Memory, etc.)**
  * SP1's virtual machine design is modular: each "chip" handles a specific function.
  * These chips interconnect to track and verify each step in the RISC-V execution.
* **Based on Plonky3**
  * SP1 extends Plonky3's AIR (Algebraic Intermediate Representation) to describe chip interconnections.
  * The **LogUp** algorithm is used to build a complete constraint system for a RISC-V CPU-based VM.
* **Memory Access Consistency**
  * Memory operations are transformed into a **permutation problem** and also solved using LogUp.
  * This ensures that memory reads/writes are consistent across the execution trace.

## Proof Contest

At any time, users have sent a set of outstanding proof requests $\{r_1, …, r_n\}$ and a set of provers $\{p_1,…,p_m\}$ are available to prove them.

$$
r_j = (f_j, s_j, deadline, …)
$$

$r_j$ : The j-th proof request.\
$f_j$ : The fee (payment) that the user attaches to the proof request.\
$s_j$ : A measure of the computation required to generate the proof. (e.g., the number of RISC-V cycles)\
`Deadline` : The maximum amount of time the user is willing to wait after the request is assigned to a prover.

Each prover has its own maximum cycle capacity and a marginal cost per cycle, denoted by $c_j$

![](img/proofcontest.png)

### 1. Single proof All-pay Auction Mechanism

#### Concept

* Used for a **single proof request** $r_j$ that multiple provers compete for.
* Each prover places a bid bi reflecting how much they are willing to pay to be assigned the proof request and receive the fee $f_j$.

#### Steps

1. **Collateral Deposit**
   * Each prover $p_i$ must deposit collateral before bidding. The collateral is reduced by the bid amount $b_i$, deterring zero-stake bids.
2. **Bidding**
   * Provers observe the request $(r_j,f_j)$ and submit bids $b_1,b_2,…,b_m$.
   * A bid $b_i$ is interpreted as: "I am willing to pay $b_i$ to earn $f_j$."
3.  **Allocation (All-Pay Auction)**

    * After all bids are placed, a single winner is chosen with probability:

    $$
    Pr(\text{winner} = p_i) = \frac{b_i^\alpha}{\sum_{k=1}^{m} b_k^\alpha}
    $$

    * Here, $\alpha > 0$ is a parameter set by the protocol that determines the degree of distribution.
      * **If** $\alpha = 0$ **:** All bidders are assigned the request with equal probability, regardless of their bid.
      * **If** $\alpha = 1$ **:** The assignment probability is proportional to each prover's bid.
      * **As** $\alpha \to \infty$ **:** The request is almost exclusively assigned to the highest bidder.
    * Every prover **actually pays** their bid (the "all-pay" feature), which may go into a contract for rebates or partial returns.
4. **Proof Submission and Payment**
   * The winning prover generates a valid proof before the `Deadline`. If successful, they receive $f_j$.
   * Failing to submit on time results in the request expiring, and that prover's collateral may be slashed.

### 2. Recurring (Slot-Based) Proof Mechanism

#### Concept

* Designed for **repeated or continuous proof requests** (e.g., a rollup requiring frequent proofs).
* Instead of bidding money for each request, provers declare how many **slots** $b_i$ they are willing to fill in a given round.

#### Steps

1. **Slot Declaration**
   * Each prover $p_i$ announces $b_i$, the number of requests they can handle per round.
2.  **Request Allocation**

    * A total of $\sum_{k=1}^m b_k$ slots are offered. Prover $p_i$ is assigned a fraction:

    $$
    \frac{b_i}{\sum_{k=1}^m b_k}
    $$

    of the recurring requests in that round.
3.  **Cost and Profit**

    * Let each request pay a fee $f_j$, and let a prover's marginal cost per proof be $c_is_j$.
      * $c_i$ : $c_i$ is the marginal cost per cycle for prover $p_i$.
      * $s_j$ : $s_j$ is a measure of the computation required for the $j$-th proof request (e.g., the number of RISC-V cycles needed).
    * Over one cycle, the total profit for prover $p_i$ might be:

    $$
    Total \ Profit_i = b_i \bigl(f_j \;-\; \sum_{k=1}^{m} b_k \;-\; c_i s_j \bigr)
    $$

    (depending on the fee model).

    * Dividing by $\sum_{k=1}^m b_k$ gives an approximate per-proof profit:

    $$
    \frac{b_i}{\sum_{k=1}^m b_k} \,(f_j - c_i s_j) \;-\; b_i
    $$
4. **Ongoing Operation**
   * This slot-based approach repeats in each cycle or round. Provers can adjust $b_i$ to secure a different share of the next batch of requests.

### Mechanism Implementation

![](img/mechanism.png)

A practical implementation of the mechanism should prevent several failure modes\
such as copied proofs and reused work.

Suppose a proof request $r_j$ is fulfilled by prover $p_i$. In the network, proofs are a function of the onchain address $a_i$ of prover $p_i$ and a unique nonce $n$, which is generated at the time the proof was requested.

We succinctly represent this dependence by $proof(r_j, a_i, n)$.

#### Preventing Copying: Embedded prover addresses

any $a_k \not= a_i$, it should be the case that the protocol can distinguish $proof(r_j, a_i, n)$ from $proof(r_j, a_k, n)$, for any $n, n'$.

#### Preventing reuse: unique nonce

every $a_i$ and for any $n, n'$, the protocol can distinguish $proof(r_j, a_i, n)$ from $proof(r_j, a_i, n')$ unless $n = n'$.

## Working Flow

![](img/workingflow.png)

### Users: Submitting Requests

1. **Prepare Request Data:**

Users submit a proof request by providing:

* **Program:** The code that needs to be executed (e.g., RISC-V bytecode generated from compiled Rust code).
* **Inputs (**$stdin$**):** The data required for running the program.
* `Max_cycles`**:** The maximum number of RISC-V cycles expected to be used in generating the proof. This parameter sets an upper bound on the computational work.
* **Maximum Fee (**$f_j$**):** The highest amount the user is willing to pay for the proof request. This fee can be set manually or suggested using a gas-estimation-like function similar to Ethereum.
* `Deadline`**:** The maximum time the user is willing to wait for a valid proof after the request is assigned to a prover.
* **Verification Key (**`vkey`**):** A key generated during an initial setup phase, used to verify the correctness of the proof.
* **Proof ID:** A unique identifier generated for each submitted request to track it.

1. **Submit the Request:**
   * The proof request, including all the parameters above, is sent to the network via a standardized RPC endpoint.
   * Once submitted, the user's fee $f_j$ is held in escrow to prevent malicious actions like griefing.
   * The network offers a high-liveness, competitive interface for submitting proof requests.
2. **Receiving the Proof:**
   * When a prover successfully generates and submits a valid proof before the `Deadline`, the user can relay that proof directly to the destination chain through the network.

### Provers: Bidding and Fulfilling Proofs

1. **Permissionless Entry:**
   * Provers join the network by connecting their hardware and running the node software.
   * They can participate without needing prior permission, although each prover has private information about their capacity and operational costs (which remain hidden from the network).
2. **Bidding Process:**
   * **Monitoring Requests:** Provers continuously monitor the network for new proof requests.
   * **Entering the Proof Contest:**
     * Once a request is published on-chain, provers participate in the proof contest.
     * The bidding window is open for a predefined, short duration to ensure transparency and efficiency, thanks to the short block times of the blockchain.
   * **Submitting a Bid:**
     * Each prover $p_i$ submits a bid $b_i$ (or declares their available "slots" in a recurring model) for the right to generate the proof.
     * The bid $b_i$ represents the amount the prover is willing to pay (from their collateral) to earn the fee $f_j$.
   * **Collateral Requirement:**
     * Before bidding, provers deposit collateral to ensure they have a stake in the process, which helps deter uncommitted or malicious behavior.

* **Fulfilling Proofs:**
  *   **Proof Generation:**

      * The winning prover uses SP1, the zero-knowledge virtual machine, to generate a proof of correct program execution.
      *   The proof is bound to the prover's on-chain address $a_i$ and a unique nonce n, represented as:

          $$
          \text{proof}(r_j,\, a_i,\, n)
          $$

      This ensures that the proof cannot be copied or reused.
  * **Submission:**
    * The prover then submits the proof, along with the proof ID, the program, the input data, and the proof information, on the application-specific blockchain.
    * The vkey submitted with the request is used by on-chain verifiers to check the validity of the proof.
  * **Proof Types:**
    * SP1 supports three types of proofs:
      * `CORE` **proofs:** Their size is proportional to the execution of the program.
      * `COMPRESSED` **proofs:** These have a constant size but incur higher (proof) generation costs.
      * `GROTH16/PLONK` **proofs:** These are the most expensive to generate but are highly compressed and can be verified on-chain.
    * In cases where `CORE` proofs are too large, users can opt for `COMPRESSED` or `GROTH16/PLONK` proofs.
  * **Payment:**
    * If the proof is valid and submitted before the `Deadline`, the fee $f_j$ is released from escrow to the prover.
    * If the proof is not submitted in time, the request expires and the prover's collateral may be slashed.
