# Is RISC-V zkVM the Endgame?

[비탈릭](https://ethereum-magicians.org/t/long-term-l1-execution-layer-proposal-replace-the-evm-with-risc-v/23617)은 최근 이더리움 L1 확장성의 장기적인 주요 병목현상은 zkEVM 자체의 한계임을 언급하며, 이를 개선하기 위한 방향으로 RISC-V 기반 zkVM을 제시하였습니다. 

이더리움 확장성을 위해 단기적으로는 block-level access lists, delayed execution과 distributed history storage 및 EIP-4444와 같은 향후 EIP를 통해 확장성 병목 현상을 해결할 수 있다고 하였습니다. 중기적으로는 statelessness와 ZK-EVMs 관련된 문제를 해결하고자 하며, **장기적으로는 1. DAS(Data Availability Sampling)과 history storage protocols의 안정성(Stability), 2. 블록 생성의 경쟁성 유지, 3. ZK-EVM proving 성능 향상**이 중요하다고 했습니다. 이 중 2, 3의 병목현상은 ZK-EVM을 RISC-V로 대체하면 해결할 수 있습니다. 

즉, 현재 이더리움의 확장성을 위해 여러 EIP들이 나오고 있지만 이는 단기적인 해결책일 뿐이며, zkEVM을 RISC-V로 대체하면 장기적인 이더리움의 문제점을 해결할 수 있습니다. 이를 통해 이더리움 실행 계층의 효율성과 단순성을 향상시키고자 합니다. 

실제 이더리움에 RISC-V 도입과 관련해서는 1. 이더리움 두가지 VM을 모두 지원하는 방법(EVM, RISC-V), 2. 현재 있는 모든 EVM 컨트랙트를 RISC-V로 만들어진 EVM Interpreter를 통해서 모두 변환하는 방법이 있습니다. 비탈릭은 Virtual Machine Interpreter를 통해 EVM으로 만들어진 컨트랙트를 모두 RISC-V로 전환하는 2번째 방법을 더 적절한 방향으로 보고 있습니다. 즉, 명령어(opcode)를 해석하고 실행하는 부분(스마트 컨트랙트의 바이트코드)에 대해서 EVM을 RISC-V로 바꾸자는 것입니다. 이는 결국 이더리움의 실행환경을 범용 CPU 수준으로 일반화하고, ZKP 기술과의 결합의 최적화를 위함입니다.

## 이더리움이 RISC-V기반 zkVM을 채택한 것에 대한 반대의견?

[Wei Dai](https://x.com/_weidai/status/1914053842888769626?ref=nockchain.org) 등 일부 커뮤니티 인사들은 RISC-V 대신 WebAssembly(WASM) 기반 zkVM 도입을 주장합니다. 그 근거로 WASM이 이미 스마트컨트랙트에 적합한 여러 특성, 특히 정적 분석의 용이성(점프 명령어 부재 등)을 갖추고 있다는 점을 들고 있습니다. 실제로 WASM은 EOF(EVM Object Format)이 도입하려는 여러 속성을 이미 내장하고 있습니다. 과거 ewasm 프로젝트에서도 WASM을 활용한 zkEVM 시도가 있었습니다.

그러나 최근 이더리움 개발자 커뮤니티는 EOF 도입에 대해 [부정적인 입장](https://www.ainvest.com/news/ethereum-developers-reject-eof-upgrade-fusaka-fork-2504/)을 보이고 있습니다. EOF는 총 11개의 EIP와 19개의 새로운 opcode를 추가해야 하는 등 복잡성이 크고, 실제로 얻을 수 있는 이점에 비해 개발 및 운영 비용이 높다는 비판이 많았습니다. 이 때문에 Fusaka 업그레이드에서 EOF 도입이 제외되었고, 커뮤니티 내에서도 WASM 기반으로 전환해야 한다는 주장이 힘을 얻지 못하고 있습니다. 

또한, RISC-V 기반 zkVM은 이미 다양한 프로젝트에서 빠른 증명 생성, 개발 편의성, 고수준 언어(Rust, C 등) 지원 등 실질적 장점을 입증하고 있습니다. Vitalik Buterin 역시 RISC-V가 EVM의 구조적 한계를 극복하고, zk 증명 효율성을 획기적으로 높일 수 있다고 평가합니다. 실제로 RISC-V는 오픈소스 ISA로 확장성·표준화·성능 최적화가 용이하며, zkVM 생태계에서 빠르게 표준으로 자리잡고 있습니다.


:::note[**What is EOF(EVM Object Format)?**]

[EOF(EVM Object Format)](/docs/miscellaneous/EOF.md)

:::

:::note[**What is WASM(WebAssembly)?**]

[WASM(WebAssembly)](/docs/miscellaneous/WASM.md)

:::
