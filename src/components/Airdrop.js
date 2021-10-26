import React from "react";

const Airdrop = () => {
  const [time, setTime] = React.useState({});
  const [seconds, setSeconds] = React.useState(20);

  const secondsToTime = (secs) => {
    let hours, second, minutes;
    hours = Math.floor(secs / (60 * 60));

    const divisor_for_minutes = secs % (60 * 60);
    minutes = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds = divisor_for_minutes % 60;
    second = Math.ceil(divisor_for_seconds);

    return {
      h: hours,
      m: minutes,
      s: second,
    };
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTime(secondsToTime(seconds - 1));
      setSeconds(seconds - 1);
    }, 1000);

    if (seconds === 0) {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [seconds]);

  React.useEffect(() => {
    let timeLeft = secondsToTime(seconds);
    setTime(timeLeft);
  }, []);

  return (
    <div style={{ color: "black" }}>
      {time.m}:{time.s}
    </div>
  );
};

export default Airdrop;
