async function main() {
  const name = "Onur Can Avci";
  const image = "https://avatars.githubusercontent.com/u/34331026?v=4";
  const participationAmount = ethers.utils.parseEther("0.01");
  const targetGiftAmount = ethers.utils.parseEther("0.3");
  const birhdate = new Date();
  birhdate.setDate(birhdate.getDate() + 1); //one day later

  const Birthday = await ethers.getContractFactory("BirthdayMoneyCollector");
  const birthday = await Birthday.deploy(
    name,
    image,
    birhdate.getTime(),
    participationAmount,
    targetGiftAmount
  );
  await birthday.deployed();
  console.log(
    "BirthdayMoneyCollector contract was deployed to:",
    birthday.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
