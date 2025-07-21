# Zisk

* X: [https://x.com/ziskvm/status/1935307212282593503](https://x.com/ziskvm/status/1935307212282593503)

* blog: [https://zisk.technology/](https://zisk.technology/)

**ZisK**는 Rust(Go와 C#은 향후 출시 예정)와 같은 high-level languages로 작성된 프로그램의 검증 가능한 실행을 가능하게 하는 zkVM을 갖춘 open-source ZKP toolstack입니다.

RISC-V 64 기반으로 구축되었으며, speed, scalability & integration을 위해 설계되었습니다.

- ZisK is **low-latency** by design, **distributed** by nature.
- ZisK **controls the entire in-house full stack**, enabling numerous **optimizations** that enhance the overall architecture.
- Targeting **128 bits security**.
- ZisK is the **Fully Open Source** (including GPU code) project. You can integrate in your own infrastructure.
- **RiscV 64 bit** architecture. Rust, golang, C#, etc.
- ZisK stack is **modular** and can allow other VMs like wasm or native LLVM

![ZisK Architecture](./img/zisk1.png)
*Source: [Twitter](https://x.com/0xAbix/status/1935323355911250275)*

ZisK는 모듈식으로 설계되었습니다. ZisK는 PIL2 기반의 일반 zkProver를 기반으로 구축되었으며, 유연하고 고성능으로 증명을 결합할 수 있는 모든 재귀 기술을 포함합니다. ZisK는 라이브러리 또는 독립형 소프트웨어로 작동하여 자체 증명을 구축할 수 있습니다.

![ZisK Modular Design](./img/zisk2.png)
*Source: [Twitter](https://x.com/0xAbix/status/1935323355911250275)*

ZisK 팀은 다른 RISC-V zkVM보다 10배 빠른 1.5GHz trace generation을 달성했습니다. 

AOT(Ahead-Of-Time) 컴파일을 통한 맞춤형 x86 어셈블리입니다. RISC-V/ZisK 명령어당 3개 또는 4개의 x86 명령어와 더불어, trace를 적절한 크기의 청크로 분할하기 위한 2개의 x86 명령어가 사용됩니다.

단기적으로 초고속 RISC-V trace 생성은 real-time proving에 필요한 GPU 수를 크게 줄일 것입니다. 장기적으로는 ASIC trace 생성 속도가 네이티브 실행 속도만큼 빨라져 real-time proving의 궁극적인 목표를 달성할 수 있을 것으로 예상됩니다.