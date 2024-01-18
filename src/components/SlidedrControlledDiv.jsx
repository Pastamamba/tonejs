import React, {useState, useEffect} from 'react';
import * as Tone from 'tone';
import "./slidercontrolleddiv.css";

// Component to display an oscillator type selection button
const OscillatorTypeButton = ({active, type, setOscillatorType}) => {
    const buttonClass = `oscillator-type-button ${active ? "active" : ""}`;
    return (
        <button className={buttonClass} onClick={() => setOscillatorType(type)}>
            {type}
        </button>
    );
};

// Main component that controls the visual and auditory elements
export const SliderControlledDiv = () => {
    // Shared state for speed
    const [speed, setSpeed] = useState(1);

    // Separate duty cycle states for each auditory channel
    const [leftDutyCycle, setLeftDutyCycle] = useState(25);
    const [rightDutyCycle, setRightDutyCycle] = useState(25);

    // States to manage oscillator types and frequencies
    const [leftOscillatorType, setLeftOscillatorType] = useState('sine');
    const [rightOscillatorType, setRightOscillatorType] = useState('sine');
    const [leftFrequency, setLeftFrequency] = useState(500);
    const [rightFrequency, setRightFrequency] = useState(500);

    // States for managing the oscillators
    const [leftOscillator, setLeftOscillator] = useState(null);
    const [rightOscillator, setRightOscillator] = useState(null);

    // State to control the visual element
    const [visualActive, setVisualActive] = useState(false);

    // Initialize oscillators and handle cleanup
    useEffect(() => {
        const leftOsc = new Tone.Oscillator(leftFrequency, leftOscillatorType).toDestination();
        const rightOsc = new Tone.Oscillator(rightFrequency, rightOscillatorType).toDestination();
        setLeftOscillator(leftOsc);
        setRightOscillator(rightOsc);
        return () => {
            leftOsc.dispose();
            rightOsc.dispose();
        };
    }, [leftFrequency, leftOscillatorType, rightFrequency, rightOscillatorType]);

    // Logic to synchronize visual and auditory elements
    useEffect(() => {
        const interval = setInterval(() => {
            setVisualActive(prev => !prev);
            if (visualActive) {
                leftOscillator.start();
                rightOscillator.start();
            } else {
                leftOscillator.stop();
                rightOscillator.stop();
            }
        }, 1000 / speed / (100 / Math.max(leftDutyCycle, rightDutyCycle)));
        return () => clearInterval(interval);
    }, [speed, leftDutyCycle, rightDutyCycle, visualActive, leftOscillator, rightOscillator]);

    // Handlers for adjusting the speed and duty cycle
    const handleSpeedChange = (e) => setSpeed(Number(e.target.value));
    const handleLeftDutyCycleChange = (e) => setLeftDutyCycle(Number(e.target.value));
    const handleRightDutyCycleChange = (e) => setRightDutyCycle(Number(e.target.value));
    const handleLeftFrequencyChange = (e) => setLeftFrequency(Number(e.target.value));
    const handleRightFrequencyChange = (e) => setRightFrequency(Number(e.target.value));

    // Render the component
    return (
        <div className="slider-controlled-div">
            <button onClick={() => Tone.start()}>Start Audio</button>
            <div className="flashing-div" style={{backgroundColor: visualActive ? 'white' : 'black'}}></div>
            <div className="controls" style={{display: 'flex', justifyContent: 'space-between'}}>
                {/* Left Auditory Controls */}
                <div>
                    <h3>Left Auditory Control</h3>
                    <label className={'control-sub-title'}>Tone (Hz): {leftFrequency}</label>
                    <input type="range" min="0" max="1000" value={leftFrequency} onChange={handleLeftFrequencyChange}/>
                    <label className={'control-sub-title'}>Duty Cycle (%): {leftDutyCycle}</label>
                    <input type="range" min="0" max="100" value={leftDutyCycle} onChange={handleLeftDutyCycleChange}/>
                    {/* Oscillator Type Buttons for Left Channel */}
                    <div style={{display: 'flex', margin: '20px 0'}}>
                        <OscillatorTypeButton active={leftOscillatorType === "sine"} type="sine"
                                              setOscillatorType={setLeftOscillatorType}/>
                        <OscillatorTypeButton active={leftOscillatorType === "square"} type="square"
                                              setOscillatorType={setLeftOscillatorType}/>
                        <OscillatorTypeButton active={leftOscillatorType === "sawtooth"} type="sawtooth"
                                              setOscillatorType={setLeftOscillatorType}/>
                        <OscillatorTypeButton active={leftOscillatorType === "triangle"} type="triangle"
                                              setOscillatorType={setLeftOscillatorType}/>
                    </div>
                </div>
                {/* Visual Control */}
                <div>
                    <h3>Visual Control</h3>
                    <label className={'control-sub-title'}>Speed (Hz): {speed}</label>
                    <input type="range" min="1" max="60" value={speed} onChange={handleSpeedChange}/>
                </div>
                {/* Right Auditory Controls */}
                <div>
                    <h3>Right Auditory Control</h3>
                    <label className={'control-sub-title'}>Tone (Hz): {rightFrequency}</label>
                    <input type="range" min="0" max="1000" value={rightFrequency}
                           onChange={handleRightFrequencyChange}/>
                    <label className={'control-sub-title'}>Duty Cycle (%): {rightDutyCycle}</label>
                    <input type="range" min="0" max="100" value={rightDutyCycle} onChange={handleRightDutyCycleChange}/>
                    {/* Oscillator Type Buttons for Right Channel */}
                    <div style={{display: 'flex', margin: '20px 0'}}>
                        <OscillatorTypeButton active={rightOscillatorType === "sine"} type="sine"
                                              setOscillatorType={setRightOscillatorType}/>
                        <OscillatorTypeButton active={rightOscillatorType === "square"} type="square"
                                              setOscillatorType={setRightOscillatorType}/>
                        <OscillatorTypeButton active={rightOscillatorType === "sawtooth"} type="sawtooth"
                                              setOscillatorType={setRightOscillatorType}/>
                        <OscillatorTypeButton active={rightOscillatorType === "triangle"} type="triangle"
                                              setOscillatorType={setRightOscillatorType}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
