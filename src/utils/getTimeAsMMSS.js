const getTimeAsMMSS = (valueInSeconds) => {
  const secondsNum = parseInt(valueInSeconds, 10);
  let minutes = Math.floor((secondsNum) / 60);
  let seconds = secondsNum - (minutes * 60);

  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  return `${minutes}:${seconds}`;
};


export default getTimeAsMMSS;
