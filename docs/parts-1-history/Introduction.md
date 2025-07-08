# Introduction

### Motivation for ZK-based scalability

블록체인 기술은 투명성, 불변성, 보안성을 핵심 가치로 내세우지만, 확장성과 프라이버시 측면에서 근본적인 한계를 안고 있습니다. 모든 거래가 공개되는 구조는 개인정보 보호에 취약하며, 네트워크가 성장할수록 처리 속도와 비용이 증가해 확장성 역시 제약을 받습니다.

이러한 문제를 해결하기 위해 등장한 것이 바로 ZKP(Zero-Knowledge Proofs)입니다. ZKP는 거래의 유효성을 증명하면서도 거래의 세부 정보(예: 송수신자, 금액 등)는 공개하지 않아 프라이버시를 보장합니다. 동시에 여러 거래를 하나의 증명으로 묶어 처리함으로써 블록체인 네트워크의 데이터 처리량을 대폭 줄이고, 거래 속도와 비용을 획기적으로 개선할 수 있습니다.

### Overview of zkEVM vs zkVM debate

ZK 기술의 적용 방식은 EVM 호환성에 중점을 둔 zkEVM과, 범용성과 최적화에 중점을 둔 zkVM으로 나뉘며, 각 방식이 지향하는 가치와 기술적 관점이 다릅니다.

**zkEVM**: EVM과 호환되는 환경에서 ZKP를 적용합니다. 기존 이더리움 생태계의 스마트 컨트랙트(주로 Solidity로 작성)를 거의 수정 없이 실행할 수 있다는 점에서 개발자 친화적입니다. 하지만 EVM의 구조적 한계와 복잡성 때문에 성능 최적화와 증명 효율성에 한계가 있습니다.

**zkVM**: EVM에 얽매이지 않고, 범용적인 가상머신(VM) 환경에 ZKP를 접목합니다. Rust, C/C++, Go 등 다양한 언어를 지원하며, 블록체인에 종속되지 않은 범용 컴퓨팅 환경에서 ZK의 이점을 극대화할 수 있습니다. 이는 확장성, 최적화, 다양한 블록체인과의 호환성 측면에서 강점을 보이지만, 기존 이더리움 생태계와의 직접적 호환성은 떨어질 수 있습니다.

### Early ZK Implementations

ZK 기술의 실질적 도입은 2016년 [Zcash](https://z.cash/)의 메인넷 론칭에서 시작되었습니다. Zcash는 [libsnark](https://github.com/scipr-lab/libsnark) 라이브러리를 활용해 zk-SNARKs를 실용적으로 적용하여, 트랜잭션의 유효성을 증명하면서도 거래 내역을 완전히 암호화하는 프라이버시 중심의 블록체인 거래를 구현했습니다. 

하지만, 초기 ZK 응용은 저수준 라이브러리(예: libsnark)를 직접 활용해야 했기 때문에 개발 난이도가 매우 높았습니다. 이를 극복하기 위해 등장한 것이 zkDSL입니다.


### zkDSL(Zero-Knowledge Domain Specific Language)
![zkDSL Overview](./img/zkdsl.png)
*Source: [OLA zkVM: A Programmable Privacy Platform for Ethereum](https://medium.com/@ola_zkzkvm/a-programmable-privacy-platform-for-ethereum-understanding-olas-design-principles-and-technical-8a47ff07e725)*
ZKDSL은 ZKP 회로(zk-circuit)를 효율적으로 설계하고 작성할 수 있도록 만든 도메인 특화 언어입니다. 개발자는 고수준의 프로그래밍 언어로 복잡한 암호 회로를 설계할 수 있으며, 이 언어로 작성된 프로그램은 산술 회로로 변환되어 증명 시스템에 전달됩니다. 대표적인 zkDSL로는 Circom, Noir, Leo, Halo2 등이 있습니다. 

zkDSL은 복잡한 연산에서는 회로 크기와 증명 생성 시간이 급격히 증가하는 성능상의 한계가 있습니다. 이러한 ZKP 회로는 테스트와 디버깅이 어려우며, 특히, 입력/증인(witness) 생성, 회로의 부분적 테스트, 성능 최적화 등이 복잡하며, DSL마다 지원 수준이 다르고, 표준화된 중간 표현(IR) 부재로 인한 호환성 문제도 있습니다. 또한, 제약 조건이 충분하지 않으면 보안 취약점이 발생할 수 있으며, 고수준 언어에 비해 표현력과 라이브러리 생태계가 제한적이라는 점에서 실용적 한계가 존재합니다.

### ZK-Rollup

이러한 ZK 기술이 확장성 솔루션으로 본격적으로 활용된 것은 1세대 ZK-Rollup의 등장부터입니다. Loopring, zkSync Lite 등은 이더리움 메인체인의 부담을 줄이기 위해 여러 거래를 오프체인에서 처리한 뒤, 그 결과만을 ZK 증명과 함께 온체인에 기록하는 방식을 채택했습니다.

이들 초기 ZK-Rollup은 주로 간단한 토큰 전송 및 교환 기능에 집중했으며, 스마트 컨트랙트 실행 등 복잡한 로직은 지원하지 못했습니다. 하지만 이 방식은 거래 처리 속도와 비용 측면에서 획기적인 개선을 보여주었고, 이후 ZK-Rollup이 이더리움 확장성 논의의 중심에 서는 계기가 되었습니다.