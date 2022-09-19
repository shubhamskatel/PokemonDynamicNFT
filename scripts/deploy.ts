import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
var BigNumber = require("big-number");
let owner: SignerWithAddress;
let pokemon: Contract;

async function main() {
  [owner] = await ethers.getSigners();

  let contract = await ethers.getContractFactory("Pokemon");
  pokemon = await contract.deploy(30);
  await pokemon.deployed();

  console.log(`Address: ${pokemon.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network MumbaiTestnet scripts/deploy.ts
