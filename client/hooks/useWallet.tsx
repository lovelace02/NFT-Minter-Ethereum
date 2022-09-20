import { useState, useEffect } from "react";
import { changeNetwork } from "../utils/changeNetwork";
declare let window: any;

// Custom hook used to login, logout, return the currentAccount
// Also verify the network to see if it's Ropsten
export const useWallet = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  //just checking if the wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  };
  // Connect function so the user can login in the app
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      await changeNetwork();
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      //verify network to see if it's ropsten

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const disconnect = () => {
    setCurrentAccount("");
  };
  return { currentAccount, disconnect, connectWalletAction };
};
