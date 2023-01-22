import { ethers } from "hardhat";
const HelloWorldContractCurrentAddress =
  "0x8d0218c44749912A3EDEF154c9BA0aEC40737495";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Termination contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const HelloWorldCF = await ethers.getContractFactory("HelloWorld");
  const helloWorldContract = HelloWorldCF.attach(
    HelloWorldContractCurrentAddress
  );

  await helloWorldContract.deployed();
  console.log("HelloWorld was deployed to:", helloWorldContract.address);

  const terminateTx = await helloWorldContract.terminate();
  const terminateRcpt = await terminateTx.wait();
  if (terminateRcpt.status == 1) {
    console.log("contract terminated");
  } else {
    console.log(terminateTx);
    console.log(terminateRcpt);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
