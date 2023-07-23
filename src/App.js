import { useEffect, useState } from 'react';
import { ReactComponent as Bottle } from './Bottle.svg'
import { ReactComponent as Ice } from './IceCube.svg'

const DEFAULT_TEMPERATURE = 70;

// State computation from data 
function getWaterState(temperature) {
  if (temperature >= 100) return 'gas';
  if (temperature <= 0) return 'solid';
  return 'liquid'
}

function App() {
  // Data setup
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);

  // State setup
  const [shape, setShape] = useState('shapeless');
  const [waterState, setWaterState] = useState(getWaterState(DEFAULT_TEMPERATURE));

  // Relationships between state and data
  useEffect(() => {
    setWaterState(getWaterState(temperature))
  }, [temperature])

  // Relationships between state and state
  useEffect(() => {
    if (waterState === 'gas' && shape !== "bottle") setShape('shapeless')
  }, [waterState, shape])

  // Data mutation from side-effects
  function handleTemperatureChange(e) {
    setTemperature(Number(e.target.value))
  }

  // State mutation from side-effects
  function handlePourOut() {
    if (waterState === 'liquid') {
      setShape('shapeless');
    }
  }
  function handlePourIntoCup() {
    if (waterState === 'liquid') {
      setShape('cup');
    }
  }
  function handlePourIntoBottle() {
    if (waterState === 'liquid') {
      setShape('bottle');
    }
  }

  // UI with lots of conditional logic, data handling and state handling
  return (
    <body className="background">
      <div className="control-plane">
        <label>temperature {temperature} C
          <div className="slider-container">
            <input placeholder='temperature' type="range" min="0" max="100" className="slider" onChange={handleTemperatureChange} value={temperature}></input>
          </div>
        </label>
        <button onClick={handlePourOut} className="ball bubble">Pour out</button>
        <button onClick={handlePourIntoCup} className="ball bubble">Pour into cup</button>
        <button onClick={handlePourIntoBottle} className="ball bubble">Pour into bottle</button>
      </div>
      <div className='info-plane'>
        <div>shape: {shape}</div>
        <div>waterState: {waterState}</div>
      </div>
      <div className="display-plane">
        {waterState === "liquid" && shape === "shapeless" && <div className='liquid'>
          <div class="drop"></div>
          <div class="wave"></div>
        </div>}

        {waterState === "solid" && <div className='snow' />}
        {waterState === "solid" && shape === "shapeless" && <div className="ice"><Ice /></div>}
        <div className="cup"></div>
        {shape === 'bottle' && <div className='vessel'><div className="bottle"><Bottle /></div></div>}
        {shape === 'cup' && <div className='vessel'><div className="cup"><img src="/glass.png" /></div></div>}
      </div>
    </body >
  );
}


export default App;
