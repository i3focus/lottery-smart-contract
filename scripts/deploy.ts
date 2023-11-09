const hre = require("hardhat");

const CONTRACT = "Lottery";

async function main() {
  // Fetch the compiled contract using Hardhat Runtime Environment (HRE)
  const Lottery = await hre.ethers.getContractFactory("Lottery");

  // Set the ticket price for the lottery
  const ticketPrice = hre.ethers.parseEther("0.01");

  // Deploy the contract
  const lottery = await Lottery.deploy(ticketPrice);

  // Wait for the contract to be deployed
  await lottery.waitForDeployment();

  console.table(lottery);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });