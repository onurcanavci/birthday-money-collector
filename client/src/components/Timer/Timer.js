import React from "react";
import { Bars } from "react-loader-spinner";

import { useCountdown } from "../../hooks/useCountDown";
import "./Timer.css";

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <p>{value}</p>
      <span>{type}</span>
    </div>
  );
};

const ExpiredNotice = () => {
  return (
    <div className='expired-notice'>
      <span>Birthday is finished!</span>
      <p color='white'>Money is collected</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className='show-counter'>
      <div className='countdown-link'>
        <p className='text'>Remaining Time!</p>
        {!seconds && (
          <Bars
            heigth='75'
            width='150'
            color='#e5771b'
            ariaLabel='loading-indicator'
          />
        )}
        {seconds && (
          <div className='date-information'>
            <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} />
            <p>:</p>
            <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay
              value={seconds}
              type={"Seconds"}
              isDanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Timer = ({ birthdate }) => {
  const [days, hours, minutes, seconds] = useCountdown(birthdate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default Timer;
