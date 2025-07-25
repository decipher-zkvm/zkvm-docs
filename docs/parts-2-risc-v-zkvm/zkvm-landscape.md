# zkVM Landscape

![landscape](./img/landscape.png)


현재 zkVM 생태계의 주요 프로젝트들을 체계적으로 분류한 다이어그램입니다.

프로젝트들은 크게 RISC-V 기반과 non RISC-V로 구분되며, RISC-V 기반 프로젝트는 ***ZK backend**에 따라 세부 분류했습니다. 분류 기준과 프로젝트 정보는 [awesome-zkvm](https://github.com/rkdud007/awesome-zkvm) 리포지토리를 참고했습니다.

:::note
**ZK Backends**<br />
The proof system, typically in the form of a (Polynomial) Interactive Oracle Proof (IOP) and Polynomial Commitment Scheme (PCS), used for the (typically non-interactive) prover-verifier checks.
:::

:::caution
- 정보 수정이나 추가 제안은 GitHub 이슈로 제보해 주세요.
:::


## RISC-V zkVM
### STARK based Projects
- [Risc Zero](https://github.com/risc0/risc0)
- [ZisK](https://github.com/0xPolygonHermez/zisk)
- [openVM](https://github.com/openvm-org/openvm)
- [powdrVM](https://github.com/powdr-labs/powdr)
- [Airbender](https://github.com/matter-labs/zksync-airbender)
- [Nexus 3.0](https://github.com/nexus-xyz/nexus-zkvm)

### Sumcheck based Projects
- [Spartan](https://github.com/microsoft/Spartan)
- [Jolt](https://github.com/a16z/jolt)
- [Ceno](https://github.com/scroll-tech/ceno)
- [SP1 HyperCube](https://github.com/succinctlabs/sp1)

## non RISC-V zkVM
### Wasm
- [zkWasm](https://github.com/DelphinusLab/zkWasm)
### MIPS
- [Ziren](https://github.com/ProjectZKM/Ziren)
- [o1VM](https://github.com/o1-labs/proof-systems/tree/master/o1vm)
### Custom ISA
- [Cairo VM](https://github.com/lambdaclass/cairo-vm)
- [Valida VM](https://github.com/lita-xyz/valida-vm)