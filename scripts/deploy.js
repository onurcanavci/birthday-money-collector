

async function main() {
    const name = 'Test';
    const participationAmount = ethers.utils.parseEther('1');

    const birhdate = new Date();
    birhdate.setDate(birhdate.getDate() + 1);//one day later

    const Birthday = await ethers.getContractFactory('BirthdayMoneyCollector');
    const birthday = await Birthday.deploy(name, birhdate.getTime(), participationAmount);
    await birthday.deployed();
    console.log("BirthdayMoneyCollector contract was deployed to:", birthday.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });