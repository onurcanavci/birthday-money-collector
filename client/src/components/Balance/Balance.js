import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import { ThreeCircles } from "react-loader-spinner";
import "./Balance.css";

const Balance = ({
  contractBalance,
  participationAmount,
  numberOfParticipant,
  targetGiftAmount,
}) => {
  const completePercentage = parseInt(
    ((numberOfParticipant * participationAmount) / targetGiftAmount) * 100
  );

  const formatToEth = (value) => {
    if (value) return `${value} ETH`;
    return 0;
  };

  return (
    <div className='money-container'>
      <div className='data'>
        <div className='item'>
          <p className='text'>Amount per person: </p>
          <p className='text'>{formatToEth(participationAmount)}</p>
        </div>
        <div className='item'>
          <p className='text'>Number of participated person: </p>
          <p className='text'>{numberOfParticipant}</p>
        </div>
        <div className='item'>
          <p className='text'>Contract balance: </p>
          <p className='text'>{formatToEth(contractBalance)}</p>
        </div>
        <div className='item'>
          <p className='text'>Target Gift Amount: </p>
          <p className='text'>{formatToEth(targetGiftAmount)}</p>
        </div>
      </div>
      <div className='circular-progress-bar-container'>
        {!completePercentage && completePercentage !== 0 && (
          <ThreeCircles
            width={150}
            height={150}
            color='#e5771b'
            outerCircleColor='white'
          />
        )}
        {completePercentage >= 0 && (
          <CircularProgressbar
            value={completePercentage}
            text={`${completePercentage}%`}
            styles={buildStyles({
              pathColor: "#e5771b",
              textColor: "#e5771b",
              trailColor: "white",
            })}
          />
        )}
      </div>
    </div>
  );
};

export default Balance;
