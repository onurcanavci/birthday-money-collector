import { useState } from "react";
import "./ContractOwnerButton.css";

const ContractOwnerButton = ({ onClick, isLoading, buttonTitle }) => {
  const [address, setAddress] = useState(null);

  return (
    <div className='contractOwner-container'>
      <input
        className='contractOwner-input'
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        className='contractOwner-button'
        type='button'
        disabled={isLoading}
        onClick={() => onClick(address)}
      >
        {isLoading ? "Loading" : buttonTitle}
      </button>
    </div>
  );
};

export default ContractOwnerButton;
