const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    //Deployed contract address
    address: "0xC7c864EB1A137E5Fb16614C6F14F0DFB6dEffeB1",
    //Pass arguments as string and comma seprated values
    constructorArguments: ["30"],
    //Path of your main contract.
    contract: "contracts/PokemonNFT.sol:Pokemon",
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network MumbaiTestnet scripts/verify.ts
