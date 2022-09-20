const { expect } = require("chai");
const { ethers } = require("hardhat");

//you can run the tests using npx hardhat test

describe("Mint NFT", function () {
  it("Should return an error of 'msg.sender is not the signer of the message'", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    const messageHash = ethers.utils.sha256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "string"],
        ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", "testtt"]
      )
    );
    let messageHashBytes = ethers.utils.arrayify(messageHash);

    const signature =
      "0xe238f65e99eea26faaa243785dc63b8c9d6abcde497fc5d00a3a541079abd5c05bb1a0a13db790d206ca38a32c3e191b21e4ee76ba4395019a80acb5c0feb6cb1b";
    // expects that the user that is sending the message and signature is not the msg.sender
    // And it should be reverted at require()
    await expect(
      nft.mintNFT("testtt", messageHashBytes, signature)
    ).to.be.revertedWith("msg.sender is not the signer of the message");
  });
});

describe("Fetch NFT", function () {
  it("Should return if the returned  value exists as an array", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    const value = await nft.fetchNFTs();
    console.log(value[0]);
    //expects that value[0] exist as an array, so if exist the function is working properly
    expect(value[0]).to.be.an("array");
  });
});

describe("Verify signer message", function () {
  it("Should return the message is signed by 0x830c86883Dd7d2D0fa72074Ff7fcB0c048C58D87 wallet", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    //hashing functions with mock data for testing purposes
    const messageHash = ethers.utils.sha256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "string"],
        ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", "testtt"]
      )
    );
    let messageHashBytes = ethers.utils.arrayify(messageHash);
    //mock signature for testing purposes
    const signature =
      "0xe238f65e99eea26faaa243785dc63b8c9d6abcde497fc5d00a3a541079abd5c05bb1a0a13db790d206ca38a32c3e191b21e4ee76ba4395019a80acb5c0feb6cb1b";
    // isMessageSigned should return the wallet that signed the message

    expect(await nft.isMessageSigned(messageHashBytes, signature)).to.equal(
      "0x830c86883Dd7d2D0fa72074Ff7fcB0c048C58D87"
    );
  });
});
