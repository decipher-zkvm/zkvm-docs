# zkEVM Era 

## What is EVM(Ethereum Virtual Machine)?

![EVM Diagram](./img/EVM.png)
*Source: [Ethereum.org](https://ethereum.org/en/developers/docs/evm/#:~:text=Diagram%20adapted%20from,a%20new%20tab)*

EVM은 이더리움 가상 머신(Ethereum Virtual Machine)으로, 이더리움 네트워크에서 트랜잭션을 실행하고 스마트 컨트랙트를 처리하는 상태 기반 실행 환경입니다. 각 이더리움 노드는 EVM 명세를 구현한 클라이언트 소프트웨어(예: Geth, Nethermind, Erigon 등)를 실행함으로써 네트워크에 참여하고, 동일한 상태 전이를 보장하며 블록을 검증합니다.

이더리움의 트랜잭션은 EVM 바이트코드 형태로 표현되며, 이는 EVM이 해석할 수 있는 저수준 명령어 집합([Opcode](https://www.evm.codes/))으로 구성되어 있습니다. EVM은 이 바이트코드를 실행하며, 스택 기반 연산, 메모리 접근, 영구 저장소(Storage) 조작 등을 통해 상태를 변경합니다. 이러한 구조 덕분에 스마트 컨트랙트는 Solidity와 같은 고급 언어로 작성된 뒤 바이트코드로 컴파일되어 EVM에서 실행될 수 있습니다.

결과적으로 EVM은 이더리움의 모든 노드가 동일한 규칙에 따라 트랜잭션을 처리하고 상태를 동기화하도록 하며, 다양한 탈중앙화 애플리케이션(DApp)의 실행 기반이 되는 핵심 요소입니다. 바이트코드에서 사용되는 명령어 집합은 EVM Opcodes에서 확인할 수 있습니다.


## What is zkEVM?

![zkEVM Overview](./img/zkEVM1.png)
*Source: [Chainlink Education Hub](https://chain.link/education-hub/zkevm)*

zkEVM은 이더리움 가상 머신(EVM) 바이트코드 기반의 스마트 컨트랙트 실행 결과에 대한 유효성 증명(validity proof)을 생성하여, 해당 오프체인 계산이 올바르게 수행되었음을 온체인에서 검증할 수 있도록 하는 시스템입니다. 여기서 핵심은 어떤 계산이 올바르게 수행되었음을 수학적으로 증명할 수 있는 기술인 영지식 증명(ZKP: Zero-Knowledge Proof)을 사용하는 것입니다. 

zkEVM을 사용하는 ZK-Rollup은 이더리움 L1의 보안 모델을 상속합니다. 이는 ZK-Rollup에서 발생한 모든 상태 전이(State Transition)가 암호학적으로 생성된 유효성 증명(Validity Proof)을 통해 검증되기 때문입니다. 해당 증명은 L1 스마트 컨트랙트 상에서 검증되며, 이를 통해 L2에서 수행된 모든 트랜잭션이 정확히 처리되었음을 L1 수준에서 수학적으로 보장합니다. 즉, L1 합의에 의존하지 않고도 L2 연산 결과의 정당성이 확정되므로, L2 사용자도 이더리움 메인넷만큼 높은 보안 수준을 누릴 수 있습니다.

ZK-Rollup은 연산은 오프체인(L2)에서 실행하고, 결과만을 요약한 증명과 최소한의 데이터만 온체인(L1)에 제출합니다. 이처럼 L2는 L1과 연산 관점에서 독립적인 구조를 설계할 수 있으며, 다음과 같은 측면에서 성능 최적화가 가능합니다.

* 병렬 처리 아키텍처 설계: L1의 싱글 스레드 EVM 구조에 얽매이지 않고 병렬 VM 처리 가능

* ZK 친화적 데이터 구조 채택: 예를 들어, Merkle Tree 대신 Poseidon-based Commitment 사용

* Opcode 최적화 또는 커스텀 명령어 도입: zk 프로빙에 불리한 EVM 구조 일부를 단순화하거나 제거 가능 (단, 이는 완전한 EVM 호환성 유지 시 제한됨)


## Representative projects

![zkEVM Projects](./img/zkEVM3.png)

[Polygon, zkSync, Scroll](https://x.com/jadler0/status/1549764211542315008), Taiko등 다양한 프로젝트들은 최초의 zkEVM을 만들고자 하였고, 서로를 견제하는 시장이 만들어지기도 했습니다. 이 프로젝트들의 공통된 목표는 ZK-SNARK 기술을 사용하여 이더리움과 유사한 거래의 암호화된 실행 증명을 만드는 것입니다. 이를 통해 이더리움 체인 자체의 검증을 훨씬 쉽게 하거나, 기존 이더리움과 거의 동일한 환경에서도 훨씬 더 확장성이 뛰어난 ZK rollup을 구축 할 수 있습니다.


![zkEVM Landscape](./img/zkEVM4.png)
*Source: [Layer 2s and the zkEVM Landscape](https://medium.com/@johnnyantos/layer-2s-and-the-zkevm-landscape-strategic-implications-9d6a10158200)*


### Type-specific stages of zkEVM (Type 1-4)

이렇게 zkEVM의 각 프로젝트마다 EVM 호환성, 증명 속도, 개발 편의성 등에서 미묘한 차이가 존재하며, 실용성과 성능의 균형을 맞추기 위해 여러 유형의 zkEVM이 등장하게 되었습니다. 

![zkEVM Types](./img/zkEVM2.png)
*Source: [Vitalik's Blog - The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)*

[비탈릭이 분류한 zkEVM](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)을 보았을 때, Type 1은 이더리움과 완전히 동일한 환경을 증명할 수 있어 기존 인프라를 그대로 활용할 수 있지만, 증명 생성 시간이 매우 오래 걸립니다. Type 2는 EVM과 거의 동일하지만, 일부 외부 구조(예: 상태 트리 등)만 변경해 약간 더 빠른 증명 생성을 지원하며, 대부분의 이더리움 앱과 호환됩니다. Type 2.5는 가스비 등 일부 파라미터만 조정해 증명 속도를 높이지만, 소수의 비호환성이 생길 수 있습니다. Type 3은 EVM과 유사하지만 일부 기능(예: 프리컴파일 등)을 제거해 증명 속도를 더 높이고, 대부분의 앱과 호환되나 일부는 수정이 필요합니다. 마지막으로 Type 4는 고수준 언어로 작성된 코드를 ZK 친화적인 VM에 직접 컴파일해 증명 속도가 가장 빠르지만, 이더리움과의 호환성이 크게 떨어집니다. 즉, 낮은 타입일수록 호환성은 높지만 느리고, 높은 타입일수록 성능은 뛰어나지만 기존 이더리움 생태계와의 호환성이 줄어드는 trade-off가 존재합니다.


## Inefficiencies of zkEVM

이처럼 zKEVM은 EVM과의 높은 호환성을 제공하는 대신, EVM의 모든 연산 작업(Opcode)을 ZKP로 증명할 수 있는 형태로 회로화하는 작업이 필요하며, 이로 인해 증명 회로를 복잡하게 만들어 성능 저하가 발생하게 됩니다. 일부 프로젝트는 Type 2.5와 같은 방식으로 증명 속도를 개선했지만, 여전히 EVM 고유의 비효율성과 ZK-unfriendliness 문제는 완전히 해소되지 않았습니다. 즉, EVM은 zk proving에 있어서 매우 비효율적인 ISA(Instruction Set Architecture)입니다.

**Stack-Based Architecture**

EVM은 256bit Stack 머신으로 설계되어 하드웨어 친화성이 낮고, 단순한 연산에도 여러 단계의 명령어가 필요하게 됩니다. 모든 연산이 스택을 통해 처리되며, 각 명령어가 이전 명령어의 결과게 직접적으로 의존하게 됩니다. 또한, 스택은 메모리의 한 영역으로 메모리 접근은 CPU 레지스터 연산보다 수십~수백배 느리기 때문에 접근 횟수가 증가하면 병목현상이 발생할 수 있습니다. 이렇게 제한적인 명령어와 256bit 산술 회로 때문에 복잡한 로직의 구현이 어렵다는 단점이 존재합니다. 

**Opcode Complexity**

EVM에는 140개가 넘는 Opcode가 존재하며, 새로운 EIP(Ethereum Improvement Proposal)가 도입될 때마다 새롭게 추가되는 Opcode를 위해서는 회로를 재설계 해야 합니다. 

**Proving Costs & Storage Overhead**

특히, Keccak-256 등의 해시 함수의 경우 각 명령마다 별도의 회로 설계가 필요하며, Poseidon 해시와 같은 zk 친화적인 해시에 비해 회로 비용이 높기 때문에 ZKP에 적합하지 않은 구조입니다.


