import { useEffect, useState } from "react";
import "./MetamaskButton.css";

const MetaMaskButton = ({ onClick, address, disabled }) => {
  const [buttonText, setButtonText] = useState("Connect to MetaMask!");
  useEffect(() => {
    if (address) {
      setButtonText(`Connected with ${address}`);
    } else {
      setButtonText("Connect to MetaMask!");
    }
  }, [address, disabled]);

  return (
    <div className='button-container'>
      <button
        className='metamask-button'
        type='button'
        disabled={disabled}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MetaMaskButton;
