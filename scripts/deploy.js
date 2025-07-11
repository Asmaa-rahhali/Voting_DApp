const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Voting = await ethers.getContractFactory("Voting");
    const contract = await Voting.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("Contract deployed to:", address);

    //? Add condidates
    const addCandidateTx1 = await contract.addCandidate("Asmaa", "QmeRjgjFdCvXH98dAxYGntajqLmKH6HUvcpoMMmNJsSvjp");
    await addCandidateTx1.wait();

    const addCandidateTx2 = await contract.addCandidate("Karim", "QmQikdRfkaDBpxAfJ53JXgrm6297LoPCpwGo4AbKtcWtzR");
    await addCandidateTx2.wait();

    console.log('====================================');
    console.log("Condidates added successfully!");
    console.log('====================================');
}   

main().catch((error) => {
    console.error(error);
    process.exit(1);
});