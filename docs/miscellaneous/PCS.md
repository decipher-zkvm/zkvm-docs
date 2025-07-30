# PCS (Polynomial Commitment Scheme)

## Group (군)
수학적으로 연산을 정의할 수 있는 원소(element)들의 집합

Group은 다음의 조건을 만족함:

- **Closure**(닫힘성): group 내의 임의의 원소 a,b에 대해 a*b가 그룹의 원소 집합 안에 존재해야 함

    - 예: 정수 덧셈 그룹에서는 a + b도 정수여야 함

- **Associativity**(결합법칙): 연산의 순서가 달라도 결과가 같아야 함

    - 예: (a + b) + c = a + (b + c)
    - [associative](https://en.wikipedia.org/wiki/Associative_property): For $\forall a, b, c \in G$, $(a * b) * c = a * (b * c)$

- **Identity Element**(항등원): 항등원 e가 존재하여, 모든 원소 a에 대해 $e * a = a * e = a$가 성립

    - 예: 정수 덧셈 그룹에서 항등원은 0, 곱셈 그룹에서는 1
    - [identity element](https://en.wikipedia.org/wiki/Identity_element): $\exists$ element $e \in G$ s.t. $e * a = a$ and $a * e = a$ for $\forall a \in G$

- **Inverse Element**(역원): 모든 원소 a에 대해 역원이 존재하여, $a * a^{-1} = e$가 성립

    - 예: 덧셈 그룹에서는 −a, 곱셈 그룹에서는 $a^{-1}$.
    - [inverse element](https://en.wikipedia.org/wiki/Inverse_element): For each $a \in G$, $\exists  b \in G$ s.t. $a * b = e$ and $b * a = e$ where $e$ is the identity element


### Cyclic Group(순환군)

: 한 개의 원소를 통해 그룹의 모든 원소를 만들어낼 수 있는 그룹

- 즉, 그룹 내 원소들은 $k \cdot G$의 형태를 가지며, k는 정수

예) $\mathbb Z_7^{*} = \{1,2,3,4,5,6\}$ (mod 7)

- $3^1\equiv3$, $3^2\equiv2$, $3^3\equiv6$, $3^4\equiv4$, $3^5\equiv5$, $3^6\equiv1$ $(\text{mod } 7)$

- 3의 지수 연산은 모든 원소를 만들어 낼 수 있고, 이러한 3을 generator라고 함

### Finite Field(유한체) $\mathbb{F}_p$

- $\mathbb{F}_p$는 크기가 p인 유한한 수의 원소를 가지는 체 (p는 소수)

- 모든 숫자가 p로 나누어지는 범위 내에서 존재하며, 덧셈/곱셈 가능


---

## Commitment Scheme

메시지의 원본은 감춘 채로 commitment 형태로 공개하고, 나중에 메시지를 열어(opening) 증명할 수 있는 암호학적 방법

**$commit(m,r) \rightarrow c$** $(m \in M, r \in R)$

**$verify(c,m,r) \rightarrow \{\text{accept},\text{reject}\}$**

### Properties of Commitment Scheme

- **Binding**
    - 하나의 커밋먼트에 대해 두 가지 유효한 opening을 만들어낼 수 없음
    - 데이터를 조작할 수 없기 때문에 무결성 보장

- **Hiding**
    - 커밋먼트가 커밋된 메시지에 대해 어떤 정보도 제공하지 않음
    - 정보를 노출하지 않고도 정보를 고정할 수 있음

## Polynomial Commitment Scheme (PCS)

암호학에서 특정 다항식을 commit하고, 그 다항식의 실질적인 내용(계수 등)을 공개하지 않은 채, **임의의 점에서 다항식의 값이 맞다는 것을 증명**할 수 있도록 설계된 프로토콜

### PCS 절차
1. Setup  
2. Commit  
3. Open/Evaluation  
4. Verification  

### 대표적인 PCS 종류
- **KZG (Kate–Zaverucha–Goldberg Commitment)**

    - Pairing 기반, 단일 group element
    - PlonK

- **IPA (Inner Product Argument)**

    - 이산 로그 기반
    - Bulletproofs

- **FRI (Fast Reed–Solomon Interactive Oracle Proof of Proximity)**

    - 해시 기반, proof 길이 김
    - STARKs

### KZG Commitment Scheme

- Finite Field $\mathbb F_p$ (p: prime number)

- Two pairing‑friendly groups: $G_1, G_2$와 $e: G_1 \times G_2 \to G_T$

- Generators: $g_1 \in G_1$, $g_2 \in G_2$

- Polynomial degree $\le d$

#### 1. Setup($1^{\lambda}$) $\rightarrow gp$ (global parameter)

- Secret parameter: $\tau {\leftarrow} \mathbb F_p$

- Global parameter: $gp = \{g_1^{\tau^0}, g_1^{\tau^1}, \dots, g_1^{\tau^{d}}, g_2, g_2^{\tau} \}$

- Delete $\tau$

#### 2. $Commit(gp, f) \rightarrow Com_f$

- $f(x) = a_0 + a_1 x + \dots + a_d x^d = \sum_{i=0}^{d} a_i x^{i}$ ($f \in \mathbb F_p^{(\le d)}[X]$)

- $Com_f = g_1^{f(\tau)}$ $$= g_1^{a_0 + a_1\tau + \dots + a_d\tau^{d}} = (g_1)^{a_0}(g_1^{\tau})^{a_1} (g_1^{\tau^{2}})^{a_2} \dots (g_1^{\tau^{d}})^{a_d}$$

- 주어진 gp로 commitment 생성 가능

#### 3. $Eval(gp, f, u) \rightarrow v, \pi$

- Goal: prove $f(u)= v$

- $\widehat f(x) := f(x) - v = (x - u)q(x)$

- $q(x) = \frac{f(x) - v}{x - u}$

- $\pi = Com_q = g_1^{q(\tau)}$

#### 4. $Verify(gp, Com_f, u, v, \pi)$ $\rightarrow$ accept or reject

- 관계식: $f(\tau) - v = (\tau - u)q(\tau)$

- Verifier가 가지고 있는 값: $(gp, Com_f, u, v, \pi = Com_q)$

    - $\tau$값을 모르기 때문에 $g^{q(\tau)\tau}$에서 곱셈으로 연결된 지수 연산 계산 불가

    - Pairing 함수를 사용하여 확인

        - Pairing 성질 : $e(P^x, Q^y) = e(P,Q)^{xy} = e(P^{xy}, Q) = e(P, Q^{xy}) = e(P^y, Q^x)$


- $$e\bigl(g_1^{f(\tau)-v}, g_2\bigr) = e\bigl(g_1^{q(\tau)}, g_2^{\tau-u}\bigr)$$

- $$e(g_1,g_2)^{f(\tau)-v} = e(g_1,g_2)^{q(\tau)(\tau - u)}$$
