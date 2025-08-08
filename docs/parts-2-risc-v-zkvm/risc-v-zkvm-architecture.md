# RISC-V zkVM Architecture

## Overview

```
Source Code (Rust)
   ↓ Compile (RISC-V Toolchain)
ELF (RISC-V Binary)
   ↓ Load
zkVM (RISC-V Emulator that generates a Zero-Knowledge Proof)
   ↓ Execute
Execution Trace (Recorded as a Table)
   ↓ Arithmetization (Convert trace and constraints into polynomials)
   ↓ Polynomial Commitment Scheme (e.g., FRI)
   ↓ Lookup Argument: Memory Consistency
Generate Zero-Knowledge Proof
```

zkVM is a system that transforms the entire process of program execution into a mathematically provable form. Through this article, we will examine each step, look at how programs are converted into Execution Traces with specific structures, and explore through concrete examples how these traces are made mathematically provable.

## RISC-V Execution Trace Extraction

RISC-V based programs are transformed into an executable form in zkVM through the following process:
![zkVM Process](./img/zkvm-process.png)

### Compilation Process

Rust officially supports various RISC-V architectures. Using this toolchain (which converts source → binary), compiling regular Rust code generates an ELF (Executable and Linkable Format) based on RISC-V ISA. The generated ELF file is in a form that can be executed by zkVM.

### RISC-V ELF Binary

The generated ELF file is loaded into zkVM where RISC-V instructions are executed sequentially. When the program needs to receive input from the outside during execution, it calls the ECALL instruction using specific system call (syscall) codes. The zkVM detects this ECALL and passes the necessary input values to the program through predefined methods (e.g., communication with the host environment) before resuming execution. For example, operations such as reading data from standard input or providing private inputs to the proof system can be performed through ECALL.

### Execution trace in zkVM

When an ELF file is executed within zkVM, all important information related to the program's state changes is recorded in a table format called the "Execution trace" for each clock cycle. This Execution trace becomes the 'witness', which is the core input data for subsequent ZKP generation.

The [STARK by Hand](https://dev.risczero.com/proof-system/stark-by-hand) document provided by the RISC Zero team shows through a concrete example (Fibonacci sequence calculation) how this Execution Trace is structured and how it is utilized in the subsequent ZKP generation process. Through this example, we will examine in detail the process from recording the Execution trace in zkVM to final ZKP generation. _(While there may be differences in the ZKP protocols or implementation methods adopted by each zkVM, the overall structure and operating principles are similar.)_

The Execution trace consists of multiple columns, with each row representing the VM state in a single clock cycle. In the STARK by Hand example (following RISC Zero zkVM), the Execution trace consists of a total of 6 columns:

![STARK Execution Trace](./img/stark1.png)

**1. Data Columns:**
The first 3 columns are Data Columns, recording the internal state of registers at each clock cycle.
- In this example, `Data Column 1`, `Data Column 2`, `Data Column 3` serve as registers storing consecutive values of the Fibonacci sequence. For instance, at clock cycle 0 (initialization phase), `Data Column 1` has the first user input 24, `Data Column 2` has the second user input 30, and `Data Column 3` has their sum 54 (modulo 97).

- In the actual RISC Zero zkVM, these Data Columns would include the RISC-V processor state, namely various microarchitecture details such as ISA registers, program counter (PC), instruction decoding data, ALU registers, etc.


**2. Control Columns:**
The next 3 columns are control columns, used to mark the initialization and termination points of execution.
- In this example, `Control Column - Initialization`, `Control Column - Transition`, `Control Column - Termination` are used.
- At clock cycle 0, `Control Column - Initialization` is 1 and the others are 0. This indicates the start of execution.
- In the intermediate transition stages (clock cycles 1, 2), `Control Column - Transition` is 1 and the others are 0.
- In the final termination stage (clock cycle 3), `Control Column - Termination` is 1, and `Control Column - Transition` is also set to 1 to apply the final transition rule while simultaneously marking termination. _(See figure above)_
- In the actual RISC Zero zkVM, Control Columns handle system start and termination as well as various other control signals.

The generated Execution Trace becomes the witness that verifies whether the program was executed correctly and whether the execution process complied with all predefined rules. What needs to be added next are various rule checks to demonstrate the validity of this execution trace.

![STARK Rule Checks](./img/stark2.png)

As can be seen in the figure, 6 rule checks have been added. Each rule is a mathematical conditional expression that verifies whether the values recorded in the Execution Trace are correct. For example, the rule "Does the Fibonacci relationship hold?" requires that adding the first two numbers should equal the next number (a + b = c). To verify this, we use the conditional expression `(Data Column 1 value) + (Data Column 2 value) - (Data Column 3 value) = 0`. If the calculation is correct, this equation must always be satisfied.

The important point is that not all rules are always applied. Control Columns act as switches for applying these rules. For example, the rule "Do the initial values match user input?" is checked only when `Control Column - Initialization` is on (value is 1), and the rule "Is the Fibonacci calculation proceeding correctly?" is checked only when `Control Column - Transition` is on.

Mathematically, we multiply the expression representing the rule by the expression representing the Control Column state, so that when the Control Column value is 0, the entire expression becomes 0 and passes regardless of rule violations, and when the value is 1, the entire expression becomes 0 and passes only when the rule is satisfied.

In the actual RISC Zero zkVM, thousands of sophisticated rules are defined and applied to every stage of the Execution Trace to verify every single action of the computer - fetching instructions, interpreting, executing, memory access, error handling, etc. All these rules must be satisfied at every step of the Execution Trace to be recognized as correct.

## Convert Trace and constraints into polynomials

### Padding the Trace
After the Execution trace is completed and rules are defined, we must prove that this trace faithfully satisfies those rules. However, if we disclose the trace as is, all values generated during calculation would be exposed, breaking the Zero-Knowledge property.

The first measure to prevent this is random padding. This is the process of adding random data unrelated to actual operations to the back of the Trace, achieving the following purposes:
1. **Hiding**: Makes it difficult to distinguish by covering actual execution data with random values.

2. **Degree Alignment**: Since the number of rows must be aligned to $2^k$ for subsequent polynomial interpolation and encoding, random rows are added as needed to maintain consistent polynomial degree.

3. **Rule Nullification**: Since rules should not apply to random data, all Control Columns for these rows are set to 0.

![STARK Padding](./img/stark3.png)

The original Execution Trace consists of 4 clock cycles (0~3), and 4 random rows are added to make a total of 8 ($2^3$) rows.

### Constructing Trace Polynomials

Now we convert each column to a unique polynomial having 8 values. This process is called Interpolation, and typically uses Lagrange Interpolation or NTT-based interpolation (iNTT: inverse Number Theoretic Transform) techniques.

Mathematically, we construct the following polynomial:
$$
P(x) = a_0 + a_1x+a_2x^2+...+ a_7x^7
$$

In the current STARK example, all operations are performed over the finite field $\mathbb{F}_{97}$.


:::note[**What is a Finite Field?**]
Unlike regular infinite real numbers, it is a mathematical structure with only a fixed number of elements. Here, we use only 97 numbers from 0 to 96, calculating through modulo 97 operations. For example, 50 + 60 = 110, but in a finite field, it becomes 110 mod 97 = 13.

In this finite field, we use a primitive root $g=5$ with special properties. This means that all numbers except 0 can be expressed as powers of 5 ($5^0, 5^1, 5^2, ..., 5^{95}$).
:::

:::note
It's fine to move on understanding just that "zkVM uses special mathematical structures to generate proofs" rather than the mathematical details of finite fields and primitive roots.
:::

To use iNTT in STARK, we need an n-th root of unity $\omega$. This is an element of $\mathbb{F}_{97}$ that satisfies $\omega^n=1$ and $\omega^k \not= 1$ (for $0\lt k \lt n$).

Since our execution trace has 8 rows, we need an 8th root of unity. Therefore, we use $5^{12}$, which acts exactly as an 8th root of unity. Through this, we can obtain 8 different evaluation points $\mathcal{D}(5^{12}) = \{5^{12k}\ | \ 0\leq k \lt 8\}$.


<!-- - $$\mathcal{D}(5^{12}) = \{5^{12k}\ | \ 0\leq k \lt 8\}$$: interpolation and Domain defining Trace polynomials
- $$\mathcal{D}(5^{3}) = \{5^{3k}\ | \ 0\leq k \lt 32\}$$: Extended Evaluation Domain (LDE) -->


For example, from the values of Data Column 1 `[24, 30, 54, 84, 78(random), 15(random), 29(random), 50(random)]`, we can construct a unique degree-7 polynomial $d_1(x)$ that passes through all 8 values.

### Reed-Solomon Encoding: Strengthening Soundness through Domain Extension
The interpolated Trace polynomials ($d_1(x), d_2(x), d_3(x), c_1(x),...$) are defined at 8 limited points. However, in the STARK protocol, these polynomials are evaluated over a wider evaluation domain. This process is called Reed-Solomon encoding or LDE (Low Degree Extension). In our example, we extend the Evaluation Domain from polynomials of degree 7 or less defined at 8 points to 32 points corresponding to $\mathcal{D}(5^{3}) = \{5^{3k}\ | \ 0\leq k \lt 32\}$.

This extension is not just a computational expansion but a core mechanism that strengthens STARK's soundness, i.e., the ability to reject incorrect proofs:

- Honest provers still submit polynomials with $degree \leq 7$, so consistency of evaluation results is maintained even in the extended domain.

- If a malicious prover constructs polynomials based on manipulated data, they generally have higher degrees, greatly increasing the probability of detection during random sampling in the extended domain.

In other words, Reed-Solomon Encoding plays the role of maximizing inaccuracy by greatly amplifying small domain manipulations or errors in the wider domain. This is the key principle that enables STARK to verify the integrity of entire computations with only a few queries later.

### Commitment to Trace Polynomials
Rather than directly disclosing the values evaluated from each trace polynomial in the extended domain $\mathcal{D}(5^{3})$, we must cryptographically commit these values so they can be referenced in the proof. The concept used for this is Merkle Tree Commitment.

We construct a Merkle Tree with the 32 evaluation values of each column as leaves and use its root as the commitment. The prover only discloses the Merkle Root and can prove the existence of specific leaves with Merkle Proofs when necessary.

One more important trick is used here. To hide the data more securely, we shift the $x$ values (evaluation points) used when calculating polynomial results. For example, instead of the originally intended $x$, using $\beta x$ (e.g., using $\beta=5$) can remove the direct correlation between values stored in the Merkle tree and actual trace values. This makes it harder to infer the original data, strengthening the Zero-Knowledge property.

### Combining into One Large Polynomial: $C_{mix}(x)$
Since checking numerous rules one by one is inefficient (the actual RISC Zero zkVM has thousands of rules), we need to combine all rules into one giant polynomial.

- **Constraint Polynomials**:<br />
We now rewrite each previously defined rule (e.g., Fibonacci rule) using the trace polynomials $d_1(x), d_2(x), d_3(x)$ representing each Data Column. For example, the Fibonacci rule is expressed as a Constraint polynomial $C_k(x)$ like $d_1(x) + d_2(x) - d_3(x) = 0$. For rules that need to reference values in the next row, we express them by substituting $x$ multiplied by the unit root $g$ instead of $x$, like $d_3(g \cdot x)$. If you understood the root of unity domain, you've noticed that $g$ here means the next step.

- **Mixing Constraint Polynomials**: <br />
We combine all constraint polynomials $C_k(x)$ into one mixed polynomial $C_{mix}(x)$.
$$
C_{mix}(x) = \sum_{k}{\alpha^k} \cdot C_k(x)
$$

### Validity Polynomial: $V(x) = C_{mix}(x)/Z(x)$
$C_{mix}(x)$ compresses whether calculations were performed correctly into a single polynomial, but to verify this effectively, we need to check whether this polynomial becomes 0 at specific points. The criterion for this is the Zero Polynomial $Z(x)$.

This polynomial $Z(x)$ has as roots all time points where actual calculations occurred in the execution trace (rows before padding, in our example the 4 specific $x$ values corresponding to clock cycles 0,1,2,3). Therefore, this $Z(x)$ has a value of 0 at those points. For example, if those 4 $x$ values are $z_0,z_1,z_2,z_3$, then $Z(x) = (x-z_0)(x-z_1)(x-z_2)(x-z_3)$.

The prover defines a new polynomial $V(x)={C_{mix}(x)}/{Z(x)}$ by dividing $C_{mix}(x)$ by this $Z(x)$. If the calculation was performed correctly, $C_{mix}(x)$ is 0 at all roots of $Z(x)$, so it divides exactly by $Z(x)$ and $V(x)$ becomes a proper polynomial. However, if rules are violated, $C_{mix}(x)$ is not 0 at at least one of the roots of $Z(x)$, resulting in a remainder from division or undefined points. This means $V(x)$ is not a polynomial and is easily detected during verification.

Finally, the prover also commits this $V(x)$ through a Merkle Tree and applies a shift to the evaluation domain to maintain the Zero-Knowledge property.

Now the entire proof is compressed to showing two key claims:
1. Does multiplying $C(x)$ by $Z(x)$ really yield $C_{mix}(x)$? $(V(x) \cdot Z(x) = C_{mix}(x))$
2. Are $V(x)$ and the trace polynomials low-degree polynomials? $(degree \leq 7)$

When these two claims are proven, it is mathematically guaranteed that the Execution Trace satisfies all constraints. DEEP-ALI is used to verify the first claim, and FRI is used to verify the second claim.

## Proving Polynomials (DEEP-ALI, FRI)

### DEEP-ALI: Proving "$V(x) \cdot Z(x) = C_{mix}(x)$ holds"
DEEP (Domain Extending for Eliminating Pretenders)-ALI (Algebraic Linking IOP) is a protocol that verifies the polynomial relationship $V(x)\cdot Z(x) = C_{mix}(x)$.

The simplest verification method would be for the verifier to select several $x$ values and check whether $V(x)\cdot Z(x) = C_{mix}(x)$ holds at each point. However, there is a limitation that if verification is only done within the already committed domain, a malicious prover could manipulate values to be correct only at those points.

DEEP-ALI improves on this. The key idea is to verify at points outside the Commitment domain (out-of-domain verification). The verifier hashes all previously generated Merkle roots to generate pseudorandom numbers and uses them to select a random point $z$ outside the commitment domain.
If the polynomial is incorrect, it can be discovered at this point. In this example, we use $z = 93$.

The prover must provide necessary information for the verifier to independently calculate $C_{mix}(93)$:
$V(93), d_1(93), d_2(93), d_3(93), c_1(93), c_2(93), c_3(93), d_2(93 \cdot 5^{-12}), d_3(93 \cdot 5^{-12})$
(Here, $5^{-12}$ means the value one step earlier in the trace.)

With these values, the verifier can calculate $C_{mix}(93)$ through the public rule checks (Constraints) and verify whether it matches $V(93) \cdot Z(93)$.

Here, the prover must additionally create DEEP polynomials to convince the verifier that the information they provided really comes from the committed polynomials.

For example, the DEEP polynomial for $d_1(x)$ is defined as follows:
$$
d'_1(x) = \frac{d_1(x)-d_1(93)}{x-93}
$$
If $d_1(93)$ is really the value of polynomial $d_1(x)$ at 93, the numerator has $(x-93)$ as a factor, so the division is exact.
Therefore, $d'_1(x)$ is still a polynomial with degree decreased by 1. Conversely, if a false value was submitted, $d'_1(x)$ would not be a polynomial.
For cases like $d'_2(x)$ where two values $(d_2(93),d_2(93 \cdot 5^{-12}))$ are provided, it is defined as follows: (Note: $93 \cdot 5^{-12} \equiv 6 \mod{97}$)
$$
d'_2(x) = \frac{d_2(x) - \overline{d_2}(x)}{(x - 93)(x - 6)}
$$
Where $\overline{d_2}(x)$ is the polynomial interpolated using the two points $(93,d_2(93)), (6, d_2(6))$.

The key properties of DEEP polynomials constructed this way are:
- If the original polynomial is low-degree and the provided evaluation values are accurate, the DEEP polynomial also maintains low degree.
- Conversely, if false values were provided, the DEEP polynomial's degree increases or it doesn't become a polynomial.

Without the DEEP technique, the prover would have to directly prove that all original trace polynomials $(d_1, d_2, d_3, c_1, c_2, c_3)$ and the validity polynomial $V$ are low-degree.
But using the DEEP technique, instead we just need to prove that the DEEP polynomials $(d'_1, d'_2, d'_3, c'_1, c'_2, c'_3, V')$ are low-degree.

This may seem like a simple transformation, but combined with out-of-domain verification, it enables high security with just a single query.
Since $z = 93$ chosen by the verifier is determined after commitment, the prover cannot manipulate it in advance.

### FRI: Proving that $V(x)$ and trace polynomials are low-degree polynomials
Now if we verify that the DEEP polynomials are low-degree polynomials, all proofs are complete.
To prove they are low-degree polynomials, we use FRI (Fast Reed-Solomon Interactive Oracle Proof of Proximity).

![FRI Protocol](./img/fri.png)
*Source: [Medium](https://medium.com/truezk/fri-commitment-scheme-afca71739fab)*

#### Mixing for FRI
It is inefficient to verify all 7 DEEP polynomials $(d'_1,d'_2,d'_3,c'_1,c'_2,c'_3,V')$ individually. Like when constructing $C_{mix}(x)$, we mix multiple polynomials into one polynomial using the random value $\alpha_2$ provided by the verifier:
$$
f_0(x) = \alpha_2^0 \cdot d'_1(x) + \alpha_2^1 \cdot d'_2(x) + ... + \alpha_2^6 \cdot V'(x)
$$
If all DEEP polynomials are low-degree, their linear combination $f_0(x)$ also maintains low degree. In the actual example, we can obtain the following $f_0(x)$:
$$
f_0(x) = 19 + 56x + 34x^2 + 48x^3 + 43x^4 + 37x^5 + 10x^6 + 0x^7
$$

#### FRI Protocol - Commit Phase
The commit phase in FRI is a folding process that repeatedly reduces the degree of the polynomial. Generally, it reduces by half. Let's look at this through the $f_0(x)$ example mentioned above.

**Round 1**:<br />
$$
f_0(x) = 19 + 56x + 34x^2 + 48x^3 + 43x^4 + 37x^5 + 10x^6 + 0x^7
$$

We separate this polynomial into even-degree and odd-degree terms:
- $f_{0,even}(x) = 19 + 34x + 43x^2 + 10x^3$
- $f_{0,odd}(x) = 56 + 48x + 37x^2 + 0x^3$

Through this, we can represent $f_0(x)$: $f_0(x) = f_{0,even}(x^2)+x \cdot f_{0,even}(x^2)$

Here we create a new polynomial using the verifier's random value $r_1 = 12$:
$$
f_1(x) = f_{0,even}(x) + r_1 \cdot f_{0,odd}(x) = f_{0,even}(x) + 12 \cdot f_{0,odd}(x)
$$

Actually calculating, we reduce from a degree-7 polynomial to a degree-3 polynomial:
$$
f_1(x) = (19 + 34x + 43x^2 + 10x^3) + 12(56 + 48x + 37x^2 + 0x^3) \\
= 12 + 28x + 2x^2 + 10x^3 \pmod{97}
$$

**Round 2, Round 3** repeat the same process:
- **Round 2**: Receiving the verifier's random value $r_2 = 32$, fold $f_1$ to generate $f_2(x) = 35 + 31x$ (degree 3 -> 1)
- **Round 3**: Receiving the verifier's random value $r_3 = 64$, fold $f_2$ to generate $f_3(x) = 79$ (degree 1 -> constant)

#### FRI Protocol - Query Phase
After the prover's Commit Phase ends, the verifier must verify through queries that the folding was performed correctly. The verifier performs random queries. Let's look at a query example assuming the verifier randomly selected $g$:
- **Round 0 (original polynomial) verification**
   - The verifier requests values $f_0(g), f_0(-g)$ from the prover.
   - The prover proves these are committed values by providing these values along with Merkle proofs.

- **Round 1 verification**
   - The verifier requests values $f_1(g^2), f_1(-g^2)$ from the prover.
   - Like Round 0 verification, receives and verifies the values along with Merkle proofs.
   - To verify correct folding, the verifier can calculate even and odd terms from previous round values as follows:
      $$
      f_{0,even}(g^2) = \frac{f_0(g) + f_0(-g)}{2}, \quad f_{0,odd}(g^2) = \frac{f_0(g) - f_0(-g)}{2g}
      $$
      Through this, $f_1(g^2)$ can be verified:
      $$
      f_1(g^2) = f_{0,even}(g^2) + r_1 \cdot f_{0,odd}(g^2)
      $$
Verification can continue this way up to Round 3. Thus the query phase efficiently verifies that all commitments submitted by the prover were really generated through correct folding.

In summary, we've seen that DEEP-ALI can safely verify polynomial relationships even at a single out-of-domain point, and FRI can efficiently verify polynomial degrees. However, the STARK by Hand example we've examined so far is a simplified version of zkVM, and actual RISC-V based zkVM has a more complex structure including memory management.

## Lookup Argument: Memory Consistency
In the actual RISC Zero zkVM implementation, there is an additional structure called Accumulator Columns besides Data Columns and Control Columns. Among the roles of Accumulator Columns, the most crucial is ensuring the consistency of RISC-V memory operations.

### Memory Consistency Problem
Let's look at the problem of memory operations in actual program execution with a simple example:
```
// Clock cycle 100
STORE x1, 0x1000    // Store value 42 at memory address 0x1000

...
// Many other instructions executed
...

// Clock cycle 500
LOAD x2, 0x1000     // Read value from memory address 0x1000 (42)
```
zkVM must prove that the value read at cycle 500 exactly matches the value stored at cycle 100. However, these two operations are 400 rows apart in the Execution Trace. It's difficult to express such relationships with just constraints between adjacent rows.

### Lookup Argument
One way to solve this problem is to convert memory access into a table lookup problem.
1. Record all memory accesses: Record all STORE/LOAD operations that occurred during execution in one table
2. Sort by address: Gather accesses to the same address and sort chronologically
3. Consistency verification: Check whether each LOAD matches the most recent STORE value for that address, etc.

Through Lookup Argument, we can convert the question "Does this value exist in the memory table?" into polynomial constraints, which are verified through FRI.

## Conclusion
In this article, we examined how arbitrary Rust programs are compiled into RISC-V binaries, how they are executed in zkVM and recorded as Execution Traces, with the purpose of providing an overview of RISC-V zkVM Architecture. This Execution Trace is a huge table containing all state changes of the program, becoming the target for the prover to prove with ZKP.

Instead of looking at actual complex RISC-V based Execution Traces, we examined step by step how Execution Traces are proven through the STARK by Hand example, which has a similar but simplified structure. Finally, we also looked at how to solve the essential memory consistency problem in actual zkVM with Lookup Arguments.

Each zkVM implementation may have different detailed methods for processing Execution Traces or techniques used for memory management. For example, RISC Zero uses a single table structure while SP1 adopts a multi-table structure. However, the overall flow of executing RISC-V instructions, recording the process as a table, and converting it to ZKP is common to all RISC-V zkVMs.

As RISC-V zkVM has become practically usable, developers can now generate ZKPs just by writing regular Rust programs without complex cryptographic knowledge. In the next article, we will examine optimization methods (e.g., Continuations, Precompiles) for maximizing zkVM performance based on this basic structure.