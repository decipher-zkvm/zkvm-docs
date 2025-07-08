# IBC Eureka

## What is IBC Eureka?
IBC Eureka는 Cosmos 생태계에서 개발된 차세대 상호운용성(interoperability) 솔루션으로, IBC v2의 최초 구현 사례이자 이더리움을 포함한 외부 체인과 Cosmos 체인을 안전하게 연결하는 공식 프로토콜입니다.
기존 IBC(IBC v1)가 Cosmos 내 체인 간 연결에 중점을 두었다면, Eureka는 이를 넘어서 Cosmos와 Ethereum 간의 직접적인, trust-minimized 양방향 연결을 실현합니다.
기술적으로 IBC Eureka는 Light Client 기반의 메시지 인증 구조를 사용하며, 이더리움과 같은 외부 체인의 구조적 제약(ex. EVM의 가스 비용 등)을 극복하기 위해 zkVM 기반의 오프체인 증명 생성을 활용합니다.
특히 Ethereum 쪽에서는 SP1 zkVM을 통해 Cosmos Hub의 Light Client 알고리즘을 오프체인에서 실행하고, 해당 결과에 대한 zkSNARK proof를 온체인에서 검증하는 구조를 가집니다.

## Why is IBC Eureka Needed?

### IBC v1의 구조적 문제
IBC는 기본적으로 상호 라이트 클라이언트를 운영하는 구조입니다. 예를 들어 이더리움과 연결되기 위해서는 Ethereum Light Client를 온체인에 배포하고, Ethrereum에서는 Cosmos Light Client가 필요합니다.
그러나 Ethereum은 온체인 연산 비용이 비싸고 제한이 많이 Tendermint 기반 Light Client를 직접 실행하는 게 사실상 불가능했습니다. 이 문제를 해결하기 위한 임시적 대안으로 Multisig 기반 브릿지 등 외부 브릿지를 도입하였지만, 이는 신뢰 모델이 깨지거나 보안 문제를 초래할 가능성이 있었습니다.

### zkVM 기반 해결책
IBC Eureka는 SP1 zkVM 기반 오프체인 Light Client 검증을 통해 Ethereum에서도 Tendermint 기반 블록 검증이 가능하도록 합니다.
그 결과로 Ethereum과 Cosmos 간 신뢰 최소화 양방향 연결이 가능해졌습니다.
정리하자면 Eureka는 IBC의 보안 철학을 유지하면서, 확장성과 사용성을 동시에 확보한 구조입니다.

### How IBC Eureka Works: Light Clients and zkVM Integration

**Architecture Overview**
![](img/ibceureka(1).png)

**개요**
Eureka는 각 체인에 다음과 같은 구성 요소를 배치합니다:

- Cosmos 측
    - Ethereum Light Client (ICS-08 Wasm 형태)를 CosmWasm으로 실행
- Ethereum 측
    - Cosmos Light Client를 직접 실행하는 게 아닌, SP1 zkVM에서 실행된 결과를 zkSNARK 증명으로 받음

**zkVM(SP1)의 역할**
![](img/ibceureka(2).png)

- Cosmos Hub에서 전송 시작
    - 사용자가 Cosmos Hub에서 Ethereum으로 IBC 전송을 시작합니다.
- Smart Relayer의 역할
    - Consensus data 가져오기
        - Smart Relayer는 Cosmos Hub로부터 합의 상태(consensus state) 데이터를 수집합니다.
    - Succint Prover Network에 증명 요청
        - 해당 데이터를 가지고 Succint Prover Network에 이 합의 상태가 맞는지 zk 증명 생성 요청합니다.
- Succint Prover Network에서 ZK Proof 생성
    - 내부적으로 SP1 zkVM을 사용해 Tendermint 라이트 클라이언트 실행하고, 그 결과로 나온 ZKP는 smark relayer에게 반환합니다.
- Smart Relayer가 Ethereum으로 데이터 제출
    - ZKP+IBC Packet을 Ethereum에 제출합니다.
- Ethereum 상에서 처리

SP1은 Rust 기반 Tendermint Light Client 코드를 실행할 수 있고, 실행 결과에 대해 SNARK 수행합니다.

→ 이 증명이 이더리움에 배포된 Light Client 스마트 컨트랙트에 제출되어 유효성 검사를 통과하면 해당 Cosmos 블록 헤더를 온체인 상태로 갱신하게 됩니다.

### 성능 및 비용 효율성
- Ethereum에서 Cosmos 체인으로 자산을 전송하는 데 빠른 모드는 약 $5, 표준 모드는 $1 이하의 비용으로 전송이 가능합니다.
- 소스 체인의 확정 시간이 길더라도, 자산은 수 초 내에 목적지 체인에 도달하게 됩니다.