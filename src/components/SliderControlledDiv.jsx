// Import necessary hooks and libraries
import {useState, useEffect, useRef} from 'react';
import * as Tone from 'tone';
import './slidercontrolleddiv.css';
import {Panner} from "tone";

// OscillatorTypeButton Component
// Renders a button for selecting oscillator type.
// Props:
// - active: Boolean indicating if this oscillator type is active.
// - type: String representing the oscillator type.
// - setOscillatorType: Function to set the oscillator type.
const OscillatorTypeButton = ({active, type, setOscillatorType}) => {
    // Determine CSS class based on whether the button is active
    const buttonClass = `oscillator-type-button ${active ? 'active' : ''}`;
    return (
        // Render the button with an onClick handler to set the oscillator type
        <button className={buttonClass} onClick={() => setOscillatorType(type)}>
            {type}
        </button>
    );
};

// SliderControlledDiv Component
// This component renders a user interface for controlling oscillators and a visual element.
export const SliderControlledDiv = () => {
    // State hooks for various control parameters
    const [speed, setSpeed] = useState(1);
    const [leftDutyCycle, setLeftDutyCycle] = useState(25);
    const [rightDutyCycle, setRightDutyCycle] = useState(25);
    const [leftOscillatorType, setLeftOscillatorType] = useState('sine');
    const [rightOscillatorType, setRightOscillatorType] = useState('sine');
    const [leftFrequency, setLeftFrequency] = useState(500);
    const [rightFrequency, setRightFrequency] = useState(500);
    const [leftOscillator, setLeftOscillator] = useState(null);
    const [rightOscillator, setRightOscillator] = useState(null);
    const [visualActive, setVisualActive] = useState(false);

    // Ref for tracking the state of each oscillator
    const oscillatorsRef = useRef({left: false, right: false});

    // Panner instances for left and right audio channels
    const leftPanner = new Panner(-1).toDestination();
    const rightPanner = new Panner(1).toDestination();

    // Effect hook for initializing and disposing of Tone.js oscillators
    useEffect(() => {
        // Create new oscillators connected to the respective panner
        const leftOsc = new Tone.Oscillator(leftFrequency, leftOscillatorType).connect(leftPanner);
        const rightOsc = new Tone.Oscillator(rightFrequency, rightOscillatorType).connect(rightPanner);
        setLeftOscillator(leftOsc);
        setRightOscillator(rightOsc);

        // Cleanup function to dispose of oscillators when component unmounts
        return () => {
            leftOsc.dispose();
            rightOsc.dispose();
        };
    }, [leftFrequency, leftOscillatorType, rightFrequency, rightOscillatorType]);

    const [visualDutyCycle, setVisualDutyCycle] = useState(50);

    const calculateSpeedMultiplier = (visualDutyCycle) => {
        return visualDutyCycle / 50;
    };

    // Function to play an oscillator for a specified duty cycle
    const playOscillator = (oscillator, dutyCycle, side) => {
        if (oscillatorsRef.current[side]) return;

        let speedMultiplier = calculateSpeedMultiplier(visualDutyCycle);
        console.log(visualDutyCycle)
        if(visualDutyCycle > 50) {
            if(visualDutyCycle > 60 && visualDutyCycle <= 85) {
                speedMultiplier = 1.3 - (speedMultiplier - 1);
            } else if (visualDutyCycle > 85) {
                speedMultiplier = 1.4 - (speedMultiplier - 1);
            }  else {
                speedMultiplier = 1 - (speedMultiplier - 1);
            }
        } else {
            if(visualDutyCycle < 30 && visualDutyCycle >= 20) {
                speedMultiplier = (1.2 - speedMultiplier) + 1;
            } else if (visualDutyCycle < 20) {
                speedMultiplier = (1.4 - speedMultiplier) + 1;
            }  else {
                speedMultiplier = (1 - speedMultiplier) + 1;
            }
        }

        oscillatorsRef.current[side] = true;
        oscillator.start();

        setTimeout(() => {
            oscillator.stop();
            oscillatorsRef.current[side] = false;
        }, (1000 / (speed * speedMultiplier * 2)) * (dutyCycle / 100));
    };

    // Effect hook to handle the timing of visual and auditory changes
    useEffect(() => {
        const interval = setInterval(() => {
            setVisualActive(true);
            playOscillator(leftOscillator, leftDutyCycle, 'left');
            playOscillator(rightOscillator, rightDutyCycle, 'right');

            setTimeout(() => {
                setVisualActive(false);
            }, (1000 / speed) * (visualDutyCycle / 100));
        }, 1000 / speed);

        return () => {
            clearInterval(interval);
        };
    }, [speed, visualDutyCycle, leftDutyCycle, rightDutyCycle, leftOscillator, rightOscillator]);


    // Event handlers for various control inputs
    const handleSpeedChange = (e) => setSpeed(Number(e.target.value));
    const handleLeftDutyCycleChange = (e) => setLeftDutyCycle(Number(e.target.value));
    const handleRightDutyCycleChange = (e) => setRightDutyCycle(Number(e.target.value));
    const handleLeftFrequencyChange = (e) => setLeftFrequency(Number(e.target.value));
    const handleRightFrequencyChange = (e) => setRightFrequency(Number(e.target.value));

    // Render the main component
    return (
        <div className='slider-controlled-div'>
            <button onClick={() => Tone.start()}>Start Audio</button>
            <div className='flashing-div' style={{backgroundColor: !visualActive ? 'black' : 'white'}}></div>
            <div className='controls' style={{display: 'flex', justifyContent: 'space-between'}}>
                {/* Left Auditory Controls */}
                <div>
                    <h3>Left Auditory Control</h3>
                    <label className={'control-sub-title'}>Tone (Hz): {leftFrequency}</label>
                    <input type='range' min='0' max='1000' value={leftFrequency} onChange={handleLeftFrequencyChange}/>
                    <label className={'control-sub-title'}>Duty Cycle (%): {leftDutyCycle}</label>
                    <input type='range' min='0' max='100' value={leftDutyCycle} onChange={handleLeftDutyCycleChange}/>
                    {/* Oscillator Type Buttons for Left Channel */}
                    <div style={{display: 'flex', margin: '20px 0'}}>
                        <OscillatorTypeButton active={leftOscillatorType === 'sine'} type='sine'
                                              setOscillatorType={setLeftOscillatorType}/>
                        <OscillatorTypeButton active={leftOscillatorType === 'square'} type='square'
                                              setOscillatorType={setLeftOscillatorType}/>
                        <OscillatorTypeButton active={leftOscillatorType === 'sawtooth'} type='sawtooth'
                                              setOscillatorType={setLeftOscillatorType}/>
                        <OscillatorTypeButton active={leftOscillatorType === 'sine2'} type='sine2'
                                              setOscillatorType={setRightOscillatorType}/>
                    </div>
                </div>
                {/* Visual Control */}
                <div>
                    <h3>Visual Control</h3>
                    <label className={'control-sub-title'}>Speed (Hz): {speed}</label>
                    <input type='range' min='1' max='60' value={speed} onChange={handleSpeedChange}/>
                    <label className={'control-sub-title'}>Duty Cycle (%): {visualDutyCycle}</label>
                    <input type='range' min='10' max='90' value={visualDutyCycle}
                           onChange={(e) => setVisualDutyCycle(Number(e.target.value))}/>
                </div>
                {/* Right Auditory Controls */}
                <div>
                    <h3>Right Auditory Control</h3>
                    <label className={'control-sub-title'}>Tone (Hz): {rightFrequency}</label>
                    <input type='range' min='0' max='1000' value={rightFrequency}
                           onChange={handleRightFrequencyChange}/>
                    <label className={'control-sub-title'}>Duty Cycle (%): {rightDutyCycle}</label>
                    <input type='range' min='0' max='100' value={rightDutyCycle} onChange={handleRightDutyCycleChange}/>
                    {/* Oscillator Type Buttons for Right Channel */}
                    <div style={{display: 'flex', margin: '20px 0'}}>
                        <OscillatorTypeButton active={rightOscillatorType === 'sine'} type='sine'
                                              setOscillatorType={setRightOscillatorType}/>
                        <OscillatorTypeButton active={rightOscillatorType === 'square'} type='square'
                                              setOscillatorType={setRightOscillatorType}/>
                        <OscillatorTypeButton active={rightOscillatorType === 'sawtooth'} type='sawtooth'
                                              setOscillatorType={setRightOscillatorType}/>
                        <OscillatorTypeButton active={rightOscillatorType === 'sine2'} type='sine2'
                                              setOscillatorType={setRightOscillatorType}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
