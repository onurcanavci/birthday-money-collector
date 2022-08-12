import "./DepositButton.css";

const DepositButton = ({ onClick, disabled, isLoading }) => {
  return (
    <div className='button-container'>
      <button
        className='deposit-button'
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? "Loading..." : "Send Money"}
      </button>
    </div>
  );
};

export default DepositButton;
