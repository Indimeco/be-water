import { ReactComponent as Bottle } from './Bottle.svg'
import { ReactComponent as Ice } from './IceCube.svg'
import { createMachine, assign, raise } from "xstate";
import { useMachine } from "@xstate/react";


const DEFAULT_TEMPERATURE = 70;

// State computation from data 
function getWaterState(temperature) {
    if (temperature >= 100) return 'gas';
    if (temperature <= 0) return 'solid';
    return 'liquid'
}

export const machine = createMachine({
    id: "water",
    // Data setup
    context: {
        temperature: DEFAULT_TEMPERATURE
    },
    on: {
        "Set temperature": {
            actions: ["setTemperature", raise("Change temperature")]
        },
    },
    // State setup
    states: {
        shape: {
            initial: "shapeless",
            // Relationships between state and state
            states: {
                shapeless: {
                    on: {
                        "Pour into cup": {
                            target: "cup",
                            cond: "liquid",
                        },
                        "Pour into bottle": {
                            target: "bottle",
                            cond: "liquid",
                        },
                    },
                },
                cup: {
                    on: {
                        "Pour into bottle": {
                            target: "bottle",
                            cond: "liquid",
                        },
                        "Pour out": [{
                            target: "shapeless",
                            cond: "liquid",
                        }, {
                            target: "shapeless",
                            cond: "gas"
                        }],
                    },
                },
                bottle: {
                    on: {
                        "Pour into cup": {
                            target: "cup",
                            cond: "liquid",
                        },
                        "Pour out": {
                            target: "shapeless",
                            cond: "liquid",
                        },
                    },
                },
            },
        },
        waterState: {
            initial: getWaterState(DEFAULT_TEMPERATURE),
            states: {
                solid: {
                    on: {
                        "Change temperature": [
                            {
                                target: "liquid",
                                cond: "liquid"
                            },
                            {
                                target: "gas",
                                cond: "gas",
                            }
                        ],
                    },
                },
                liquid: {
                    on: {
                        "Change temperature": [
                            {
                                target: "solid",
                                cond: "solid"
                            },
                            {
                                target: "gas",
                                cond: "gas",
                            }
                        ],
                    },
                },
                gas: {
                    entry: raise("Pour out"),
                    on: {
                        "Change temperature": [
                            {
                                target: "solid",
                                cond: "solid"
                            },
                            {
                                target: "liquid",
                                cond: "liquid"
                            },
                        ],
                    },
                },
            },
        },
    },
    type: "parallel",
}, {
    predictableActionArguments: true,
    // Data mutation from side-effects
    actions: {
        setTemperature: assign({
            temperature: (_, event) => Number(event.value)
        })
    },
    // Relationships between state and data
    guards: {
        solid: (context) => getWaterState(context.temperature) === 'solid',
        liquid: (context) => getWaterState(context.temperature) === 'liquid',
        gas: (context) => getWaterState(context.temperature) === 'gas',
    }
})

function App() {
    const [state, send] = useMachine(machine);
    const { shape, waterState } = state.value;
    const { temperature } = state.context;

    // UI with lots of conditional logic, data handling and state handling
    return (
        <body className="background">
            <div className="control-plane">
                <label>temperature {temperature} C
                    <div className="slider-container">
                        <input placeholder='temperature' type="range" min="0" max="100" className="slider" onChange={(e) => send("Set temperature", { value: e.target.value })} value={temperature}></input>
                    </div>
                </label>
                <button onClick={() => send("Pour out")} className="ball bubble">Pour out</button>
                <button onClick={() => send("Pour into cup")} className="ball bubble">Pour into cup</button>
                <button onClick={() => send("Pour into bottle")} className="ball bubble">Pour into bottle</button>
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
