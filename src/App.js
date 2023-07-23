import { useEffect, useState } from 'react';

const DEFAULT_TEMPERATURE = 70;

function getWaterState(temperature) {
  if (temperature >= 100) return 'gas';
  if (temperature <= 0) return 'ice';
  return 'liquid'
}

function App() {
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const [shape, setShape] = useState('shapeless');

  const [waterState, setWaterState] = useState(getWaterState(DEFAULT_TEMPERATURE));

  useEffect(() => {
    setWaterState(getWaterState(temperature))
  }, [temperature])

  useEffect(() => {
    if (waterState === 'gas') setShape('shapeless')
  }, [waterState])

  function handleTemperatureChange(e) {
    setTemperature(Number(e.target.value))
  }

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

  return (
    <body className="background">
      <div className="control-plane">
        <label>temperature
          <div className="slider-container">
            <input placeholder='temperature' type="range" min="0" max="100" className="slider" onChange={handleTemperatureChange} value={temperature}></input>
          </div>
        </label>
        <button onClick={handlePourOut} className="ball bubble">Pour out</button>
        <button onClick={handlePourIntoCup} className="ball bubble">Pour into cup</button>
        <button onClick={handlePourIntoBottle} className="ball bubble">Pour into bottle</button>
      </div>
      <div className='info-plane'>
        <div>temperature: {temperature}*C</div>
        <div>shape: {shape}</div>
        <div>waterState: {waterState}</div>
      </div>
      <div className="display-plane">
        <div class="drop"></div>
        <div class="wave"></div>
        <div className="shapeless"></div>
        <div className="cup"></div>
        <div className="bottle"></div>
      </div>
    </body>
  );
}


export default App;
