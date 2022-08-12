import { ethers } from "ethers";
import { contractAbi } from "./contractAbi";

const provider = ethers.getDefaultProvider(
  ethers.providers.getNetwork("ropsten")
);

const metamaskProvider = new ethers.providers.Web3Provider(
  window.ethereum,
  "any"
);
export const signer = metamaskProvider.getSigner();
export const signedContract = (contractAddress) =>
  new ethers.Contract(contractAddress, contractAbi, signer);

export const customContract = (contractAddress) =>
  new ethers.Contract(contractAddress, contractAbi, provider);
