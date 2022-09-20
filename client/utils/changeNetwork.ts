const defaultChainId = 3;
//function to change to verify and change to ropsten network
export const changeNetwork = async () => {
  const { ethereum } = window;

  const chainId = await ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0x3") alert("Please Change to Ropsten");
  console.log(chainId);
  if (chainId !== "0x3") {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${defaultChainId.toString(16)}` }],
      });
    } catch (Err: any) {
      console.log(Err);
    }
  }
};
