async function mainVerify() {
  // The deployed constract address
  const contractAddress = "0x7E60096Ad44515b1d3f65390C90BCBa88902BA26";

  const constructorArguments = [
    hre.ethers.parseEther("0.01")
  ];

  // Aguardar a verificação do contrato
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: constructorArguments,
  });
}

mainVerify()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
