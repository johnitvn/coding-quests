import React, { useEffect, useRef } from 'react';
import '../styles/_rocket.scss';

const SECONDS_TO_TAKEOFF = 5;
const MS_TO_TAKEOFF = SECONDS_TO_TAKEOFF * 1000;
const FINAL_POSITION_BOTTOM_VAL = 'calc(400px)';

function timeToPositionPercent(startTime) {
  const now = Date.now();
  const timeDiff = now - startTime;

  if (timeDiff >= MS_TO_TAKEOFF) { return FINAL_POSITION_BOTTOM_VAL; }

  return `calc(300px + ${((timeDiff / MS_TO_TAKEOFF) * 100).toFixed(0)}%)`;
}

function generateEmptyListEls(id, quantity) {
  return [...Array(quantity)].map((_v, index) => <li key={`${id}-${index}`} />);
}

export default function RocketCore({ initialLaunchTime }) {
  console.log("Rocket Core Rendering")
  const rocketRef = useRef(false);
  useEffect(() => {
    setInterval(() => {
      if (rocketRef.current)
        rocketRef.current.style.bottom = timeToPositionPercent(initialLaunchTime);
    }, 500)
  }, [initialLaunchTime])

  return (
    <>
      <div className="rocket" ref={rocketRef}>
        <div className="rocket__body">
          <div className="rocket__body__main" />
          <div className="rocket__body__fin rocket__body__fin__left" />
          <div className="rocket__body__fin rocket__body__fin__right" />
          <div className="rocket__body__window" />
        </div>
        <div className="rocket__exhaust__flame" />
        <ul className="rocket__exhaust__fumes">
          {generateEmptyListEls(1, 9)}
        </ul>
      </div>
      <ul className="stars">
        {generateEmptyListEls(2, 7)}
      </ul>
    </>
  );
}
