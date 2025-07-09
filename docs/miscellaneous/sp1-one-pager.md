# SP1 One-Pager

[_SP1 Technical Whitepaper_](https://drive.google.com/file/d/1aTCELr2b2Kc1NS-wZ0YYLKdw1Y2HcLTr/view)_을 정리한 글입니다._

## 핵심 정리

Rust 프로그램을 RISC-V 기반의 Execution Trace(하나의 큰 Table)로 만들고, 그 큰 Table을 각각의 목적에 맞게 여러 Table로 분할해서 표현하고, 각 Table 및 메모리와의 연결은 LogUp을 통해서 만족시킵니다. Table이 커지면 증명 과정의 오버헤드(메모리 문제) 때문에 이를 Shard로 나눠서 증명하고, SP1이 따로 만든 Recursive VM으로 aggregation해서 하나의 작은 증명으로 만듭니다. (여기서 더 필요하면 Groth16으로 Wrapping해서 더 작게 만듭니다)

## 개요

SP1은 일반적인 Rust 프로그램의 실행을 STARK 기반 ZK-Proof로 생성해주는 RISC-V 기반 zkVM입니다. 개발자는 복잡한 zk Circuit을 따로 설계할 필요 없이 Rust 코드만 작성하면, SP1이 이를 RISC-V로 컴파일하고 실제로 실행한 뒤, **입력에 대한 출력이 정확하게 계산되었음을 증명**해줍니다.

SP1 zkVM Circuit은 Plonky3 오픈소스 라이브러리를 통해 구현되었으며, 필요한 여러 Circuit(e.g., keccak256)들 중 Plonky3 구현체를 가져와 사용하기도 합니다.

SP1은 프로그램 실행 정보를 기능별로 나누어 각각의 Table로 만든 "Multi-Table 구조"를 사용하며, Table들 간의 연산 일관성은 "LogUp"이라는 lookup 프로토콜로 연결됩니다. 또한 메모리의 상태 변화는 별도의 Table 없이 추적하는 "Memory in the Head" 방식으로 증명되며, 대규모 프로그램도 SP1에서 효율적으로 처리할 수 있도록 Sharding 메커니즘을 사용합니다.

## From RISC-V Execution Trace to STARK

RISC-V 프로그램을 추상화한 Execution Representation을 `ExecutionRecord`라고 부릅니다. 여기서 증명되어야 할 것들이 Events로 기록되어 있습니다 (예: CpuEvent, AluEvent 등). `ExecutionRecord`를 통해 Trace(= Table)를 생성합니다. 아래처럼 각 명령어 타입에는 대응되는 Chip(e.g., AddSubChip)이 있습니다. Chip은 Table이 따라야 할 제약조건(AIR Constraint)라고 생각하면 됩니다.

![SP1 Trace](./img/sp1_trace.png)
*SP1 ExecutionRecord와 Chip 구조 (출처: [Medium](https://medium.com/@gavin.ygy/mastering-sp1-zkvm-design-part-2-air-constraints-for-core-proof-1565ff5aed8f))*

SP1이 사용하는 BabyBear Field는 $2^{31}$ 크기를 가지므로 RISC-V 32비트 값을 표현하기 위해 u32를 4 bytes(32비트)로 나누어 각각의 byte를 BabyBear Field로 인코딩합니다. (이들이 실제 byte에서 왔는지 보장하기 위해 Range Check를 합니다) → 이러면 아래의 'Preprocessed Table'에서 설명하는 byte Table도 작아서 이점이 있습니다.

:::tip
CPU 클럭이 7일 때, runtime에서 ADD 명령어를 만난다고 가정 (입력값은 2와 3)

**AluEvent**에는
- a: 5 (출력)
- b: 2
- c: 3
- clk: 7

**CpuEvent**에는
- instruction: ADD
- a\_record: a에 대한 메모리 접근
- b\_record, c\_record도 동일
- pc: 현재 시점 프로그램 카운터 값

여기서 `generate_trace()`(record → trace) 호출되면 CpuChip과 AddSubChip은 위 데이터 기반으로 각자의 Table에 row를 추가합니다. (이 row의 각 entry는 모두 BabyBear 필드의 원소)

AddSubChip은 $5 = 2 + 3$을 강제하는 Constraint가 있고, CpuChip은 클럭 7에서 레지스터 0의 값이 5임을 강제하는 메모리 접근 Constraint가 있습니다.

Cpu table ↔ Add table 간의 값 일치는 LogUp으로 보장합니다. (각 Table은 독립적이므로 이런 과정이 필요)
:::

## The "Beams" (Multi-Table Trace)

SP1는 Multi-Table 구조로, 여러 개의 Table이 서로 협력해서 프로그램 실행에 대한 증명을 생성하는 방식입니다.

이 구조의 중심에는 **CPU Table**이 있으며, 실행 기록에 포함된 모든 명령어들이 이 Table에 나타납니다.

각각 **CPU Table, ALU Tables, Memory Tables, Precompiled Tables, Other Tables**가 존재합니다.

![SP1 Chip](./img/sp1_chip.png)
*여기서 Chip은 Table로 생각해도 무방합니다. 논문에서 Table들을 설명한 걸 시각화한 자료입니다. (출처: [Medium](https://trapdoortech.medium.com/zero-knowledge-proof-introduction-to-sp1-zkvm-source-code-d26f88f90ce4))*

### Preprocessed Table

Prover가 setup의 일종으로 미리 commit하는 Table입니다. 다른 Table에서 lookup할 수 있지만 이 Table에는 Constraint는 없습니다. 대표적으로 Byte Table, Program Table이 있습니다.

* **Byte Table**: u8 산술 연산 및 range check용
* **Program Table**: PC와 명령어가 저장되어 있음

### Precompiled Table

SHA, Keccak 같이 복잡한 연산을 담당하는 전용 Table입니다. CPU Table에서 syscall처럼 위임하여 해당 Table이 알아서 연산을 검증합니다.

## Joint (Cross-Table Communication)

Table ↔ Table lookup과 memory lookup은 모두 LogUp에 의해 처리됩니다. LogUp의 역할은 서로 다른 Table이 데이터를 주고받을 때, 그 값이 정확히 일치하는지 증명해주는 것입니다.

**예시**

* CPU Table이 AddSub Table의 (a, b, c) 값을 lookup하고자 할 때
* CPU Table은 (a, b, c) 값을 "보냄 (send)"
* AddSub Table은 동일한 (a, b, c) 값을 "받음 (receive)"
* 각 행은 fingerprint로 변환되어 LogUp bus에 합산됨
* 최종적으로 전체 send fingerprint 합 = 전체 receive fingerprint 합(Running Sum)을 검증

## Sharding (and Recursion)

Execution Trace가 너무 크면, 메모리 문제 등등이 생길 수 있습니다. 그래서 Execution Trace를 여러 조각(shard)으로 나눠서 각각 증명합니다. Shard 간 연결 또한 LogUp을 사용합니다.

(예시: Tendermint light client verification은 3천만 cycles. 논문에서는 Shard size를 $2^{22}$로 사용한다고 명시되어 있습니다.)

![SP1 Sharding](./img/sp1_sharding.png)
*[SP1 Technical Whitepaper](https://drive.google.com/file/d/1aTCELr2b2Kc1NS-wZ0YYLKdw1Y2HcLTr/view)*

Shard Proof 두 개를 하나의 상위 증명으로 생성하거나, 마지막에 Groth16 같은 SNARK로 wrapping하는 단계는 Recursion이라고 부르며, SP1은 이 recursion을 위해 전용 custom ISA zkVM(SP1과는 다름)을 사용합니다.

:::info
1. trace ↔ table 같은 의미로 사용
2. bus ↔ accumulator ↔ running sum 같은 의미로 사용
:::