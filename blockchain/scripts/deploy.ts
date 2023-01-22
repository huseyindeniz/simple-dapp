import { ethers } from "hardhat";

async function main() {
  const HelloWorldCF = await ethers.getContractFactory("HelloWorld");
  const helloWorldContract = await HelloWorldCF.deploy();

  await helloWorldContract.deployed();

  console.log(`HelloWorld deployed to ${helloWorldContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
