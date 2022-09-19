import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import {
  mineBlocks,
  convertWithDecimal,
  customError,
} from "./utilities/utilities";
import { expect } from "chai";
import { loadFixture } from "ethereum-waffle";
import { Contract } from "ethers";
var BigNumber = require("big-number");

describe("Test", async () => {
  let pokemon: Contract;
  let owner: SignerWithAddress;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    let contract = await ethers.getContractFactory("Pokemon");
    pokemon = await contract.deploy(30);
    await pokemon.deployed();
  });

  it("Contract is deployed", async () => {
    let interval = await pokemon.interval();
    expect(interval).to.be.eq(30);

    let ownerOfNft = await pokemon.ownerOf(0);
    expect(ownerOfNft).to.be.eq(owner.address);

    let stage = await pokemon.pokemonStage(0);
    expect(stage).to.be.eq(0);
  });

  it("Cannot grow before interval time", async () => {
    let initialStage = await pokemon.pokemonStage(0);

    await pokemon.performUpkeep([]);
    let finalStage = await pokemon.pokemonStage(0);

    expect(initialStage).to.be.eq(finalStage);
  });

  it("Grows after interval ends", async () => {
    let initialStage = await pokemon.pokemonStage(0);

    await mineBlocks(ethers.provider, 31);

    await pokemon.performUpkeep([]);
    let finalStage = await pokemon.pokemonStage(0);

    expect(initialStage + 1).to.be.eq(finalStage);
  });

  it("Grows after interval ends multiple times", async () => {
    let initialStage = await pokemon.pokemonStage(0);

    await mineBlocks(ethers.provider, 31);

    await pokemon.performUpkeep([]);
    let nextStage = await pokemon.pokemonStage(0);
    expect(initialStage.add(1)).to.be.eq(nextStage);

    await mineBlocks(ethers.provider, 31);

    await pokemon.performUpkeep([]);
    let finalStage = await pokemon.pokemonStage(0);
    expect(initialStage.add(2)).to.be.eq(finalStage);
  });
});
