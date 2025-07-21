# SP1

## SP1 Hypercube 엔진 출시

* X: [https://x.com/SuccinctLabs/status/1924845712921264562](https://x.com/SuccinctLabs/status/1924845712921264562)

* blog: [https://blog.succinct.xyz/sp1-hypercube/](https://blog.succinct.xyz/sp1-hypercube/)

SP1 Hypercube는 이더리움을 위한 real-time proving을 제공하며, 이는 **multilinear polynomial**을 기반으로 설계된 완전히 새로운 증명 시스템 위에 구축되었습니다. SP1 Turbo보다 최대 5배 향상된 latency와 cost 측면에서 최첨단 결과를 제공하며, 이더리움 블록의 93% 이상을 12초 이내에 증명할 수 있습니다.

### Multilinear Polynomial Revolution

**SP1 Turbo**를 포함한 이전 버전의 SP1은 Plonky3를 사용하는 STARK 기반 아키텍처를 기반으로 구축되어, 단변수(univariate) 다항식에 의존합니다. 이를 도형으로 생각해보면, 다변수 다항식은 구와 같이 elegant하지만 비효율적으로 채워져 있습니다.

**SP1 Hypercube**는 multilinear polynomials을 기반으로 설계되었습니다. Multilinear 다항식은 직사각형처럼 생겨서 틈새없이 잘 채워져 낭비되는 공간이없습니다. 이러한 "packing efficiency"은 더 빠른 검증 성능과 더 낮은 리소스 비용으로 직접 변환됩니다.

![Multilinear vs Univariate Polynomials](./img/sp11.png)
*Source: [Twitter](https://x.com/calicocat2025/status/1928674456022691974)*


### Jagged PCS – The Core Engine of SP1 Hypercube

범용 프로그램에서 zkVM은 다양한 높이의 열로 구성된 trace table을 생성합니다. 이때 기존 시스템은 가장 높은 열에 맞춰 패딩(padding)하여 똑같은 크기로 만들었습니다. 하지만 이는 빈 공간까지 증명해야 하므로 증명크기가 커지고, 재쥐적으로 증명할 때도 비효율적입니다. 또한, 개별 다항식에 따로 커밋하는 방식은 해시 기반 시스템에서 특히 검증 비용이 매우 큽니다.

이러한 문제를 해결하기 위해 **Jagged PCS**라는 새로운 구조를 사용하는데, 이는 열마다 높이가 다른 “jagged” matrix로 생각할 수 있습니다. 이 방식은 열마다 높이가 달라도, 전체 트레이스를 하나의 다항식으로 커밋할 수 있습니다. 이때 검증자는 개별 열을 커밋한 것처럼 필요한 부분만 확인할 수 있도록 하여 효율적인 구조입니다.

![Jagged PCS Architecture](./img/sp12.png)
*Source: [Twitter](https://x.com/Liu_xoke/status/1925602251294613906)*

이러한 Jagged PCS로, "pay only for what you use" 아키텍처를 구현합니다. 이는 다중 선형 친화적인 sumcheck protocol인 LogUp GKR의 고도로 최적화된 구현과 결합되어 SP1 Hypercube의 성능 향상의 기반을 형성합니다.

### Benchmarks

먼저, real-time Ethereum proving을 “이더리움 메인넷 블록의 90% 이상을, stateless 실행을 위한 블록 및 머클 증명(Merkle proof) 데이터를 주어진 상황에서, 12초 이내에 증명하는 것”이라고 정의합니다. SP1 Hypercube는 이 기준을 넘어서 93%의 블록이 12초 미만에 증명되었으며, 평균 증명 시간은 10.3초입니다.

남은 7%의 블록에 대해서도, 이더리움의 gas schedule을 실제 계산 복잡도에 맞게 조정하면, 증명자의 실제 작업량과 복잡도 간의 불일치를 해소하고 성능을 더 끌어올릴 수 있을 것이라 기대합니다.

- SP1 v3.0.0: ~200 seconds

- SP1 Turbo: ~40 seconds

- SP1 Hypercube: 10.3 seconds

![SP1 Performance Comparison](./img/sp13.png)
*Source: [SP1 Hypercube Blog](https://blog.succinct.xyz/sp1-hypercube/)*

SP1 Hypercube는 증명자 스택(prover stack) 전반에 걸쳐 end-to-end 최적화를 도입했습니다. 이에는 개별 RISC-V 명령어의 효율적인 실행부터 low-latency recursion까지 포함됩니다. 이러한 최적화 덕분에 SP1 Hypercube는 이더리움에서 real-time proving을 가능하게 하면서도, SP1 Turbo보다 훨씬 적은 수의 GPU(약 2배 절감)만으로도 운영할 수 있습니다.

SP1 Hypercube로 이더리움 메인넷 블록의 90% 이상을 실시간으로 증명할 수 있는 클러스터는 약 160개의 RTX 4090 GPU를 필요로 하며, 이는 약 30만~40만 달러의 비용으로 구축 가능합니다. 또한, 더 비용 효율적인 하드웨어를 사용할 경우, 클러스터 구축 비용은 약 10만 달러 수준까지 줄일 수 있을 것으로 예상됩니다.

![SP1 Hypercube Cost Analysis](./img/sp14.png)
*Source: [Twitter](https://x.com/calicocat2025/status/1928674456022691974)*