import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import './slidercontrolleddiv.css';

const OscillatorTypeButton = ({ active, type, setOscillatorType }) => {
    const buttonClass = `oscillator-type-button ${active ? 'active' : ''}`;
    return (
        <button className={buttonClass} onClick={() => setOscillatorType(type)}>
            {type}
        </button>
    );
};

export const SliderControlledDiv = () => {
    const [speed, setSpeed] = useState(1);
    const [leftDutyCycle, setLeftDutyCycle] = useState(25);
    const [rightDutyCycle, setRightDutyCycle] = useState(25);
    const [leftFrequency, setLeftFrequency] = useState(500);
    const [rightFrequency, setRightFrequency] = useState(500);
    const [leftOscillatorType, setLeftOscillatorType] = useState('sine');
    const [rightOscillatorType, setRightOscillatorType] = useState('sine');
    const [visualActive, setVisualActive] = useState(false);

    const leftGainRef = useRef(null);
    const rightGainRef = useRef(null);
    const leftOscRef = useRef(null);
    const rightOscRef = useRef(null);

    useEffect(() => {
        // Initialize panners
        const leftPanner = new Tone.Panner(-1).toDestination();
        const rightPanner = new Tone.Panner(1).toDestination();

        // Initialize gain nodes
        leftGainRef.current = new Tone.Gain(0).connect(leftPanner);
        rightGainRef.current = new Tone.Gain(0).connect(rightPanner);

        // Initialize oscillators
        leftOscRef.current = new Tone.Oscillator(leftFrequency, leftOscillatorType).connect(leftGainRef.current).start();
        rightOscRef.current = new Tone.Oscillator(rightFrequency, rightOscillatorType).connect(rightGainRef.current).start();

        return () => {
            leftOscRef.current.stop().dispose();
            rightOscRef.current.stop().dispose();
        };
    }, [leftFrequency, leftOscillatorType, rightFrequency, rightOscillatorType]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisualActive(prevState => !prevState);
        }, 1000 / speed);

        return () => clearInterval(interval);
    }, [speed]);

    useEffect(() => {
        const soundDurationLeft = 1000 / speed * (leftDutyCycle / 100);
        const soundDurationRight = 1000 / speed * (rightDutyCycle / 100);

        if (visualActive) {
            leftGainRef.current.gain.setValueAtTime(1, Tone.now());
            rightGainRef.current.gain.setValueAtTime(1, Tone.now());

            setTimeout(() => {
                leftGainRef.current.gain.cancelScheduledValues(Tone.now());
                leftGainRef.current.gain.setValueAtTime(0, Tone.now());
            }, soundDurationLeft);

            setTimeout(() => {
                rightGainRef.current.gain.cancelScheduledValues(Tone.now());
                rightGainRef.current.gain.setValueAtTime(0, Tone.now());
            }, soundDurationRight);
        } else {
            leftGainRef.current.gain.setValueAtTime(0, Tone.now());
            rightGainRef.current.gain.setValueAtTime(0, Tone.now());
        }
    }, [visualActive, speed, leftDutyCycle, rightDutyCycle]);

    // Event handlers
    const handleSpeedChange = (e) => setSpeed(Number(e.target.value));
    const handleLeftFrequencyChange = (e) => setLeftFrequency(Number(e.target.value));
    const handleRightFrequencyChange = (e) => setRightFrequency(Number(e.target.value));
    const handleLeftDutyCycleChange = (e) => setLeftDutyCycle(Number(e.target.value));
    const handleRightDutyCycleChange = (e) => setRightDutyCycle(Number(e.target.value));
    const handleLeftOscillatorTypeChange = (type) => setLeftOscillatorType(type);
    const handleRightOscillatorTypeChange = (type) => setRightOscillatorType(type);

    return (
        <div className='slider-controlled-div'>
            <button onClick={() => Tone.start()}>Start Audio</button>
            <div className='flashing-div' style={{ backgroundColor: visualActive ? 'white' : 'black' }}></div>
            <div className='controls' style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* Left Auditory Controls */}
                <div className='audio-controls'>
                    <div className='audio-controls'>
                        <h3>Left Auditory Control</h3>
                        <div className='controls-grid'>
                            <div className='control-item'>
                                <label htmlFor="leftFrequency">Tone (Hz): {leftFrequency}</label>
                                <input id="leftFrequency" type='range' min='0' max='2000' value={leftFrequency}
                                       onChange={handleLeftFrequencyChange}/>
                            </div>
                            <div className='control-item'>
                                <label htmlFor="leftDutyCycle">Duty Cycle (%): {leftDutyCycle}</label>
                                <input id="leftDutyCycle" type='range' min='1' max='100' value={leftDutyCycle}
                                       onChange={handleLeftDutyCycleChange}/>
                            </div>
                        </div>
                    </div>
                    <div style={{margin: "1em"}}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <OscillatorTypeButton active={leftOscillatorType === 'sine'} type='sine'
                                                  setOscillatorType={handleLeftOscillatorTypeChange}/>
                            <OscillatorTypeButton active={leftOscillatorType === 'square'} type='square'
                                                  setOscillatorType={handleLeftOscillatorTypeChange}/>
                            <OscillatorTypeButton active={leftOscillatorType === 'sawtooth'} type='sawtooth'
                                                  setOscillatorType={handleLeftOscillatorTypeChange}/>
                            <OscillatorTypeButton active={leftOscillatorType === 'triangle'} type='triangle'
                                                  setOscillatorType={handleLeftOscillatorTypeChange}/>
                        </div>
                    </div>
                </div>

                {/* Visual Control */}
                <div className='visual-controls'>
                    <h3>Visual Control</h3>
                    <div>
                        <label>Speed: {speed}</label>
                        <input type='range' min='1' max='60' value={speed} onChange={handleSpeedChange} />
                    </div>
                </div>

                {/* Right Auditory Controls */}
                <div className='audio-controls'>

                    <div className='audio-controls'>
                        <h3>Right Auditory Control</h3>
                        <div className='controls-grid'>
                            <div className='control-item'>
                                <label htmlFor="rightFrequency">Tone (Hz): {rightFrequency}</label>
                                <input id="rightFrequency" type='range' min='0' max='2000' value={rightFrequency}
                                       onChange={handleRightFrequencyChange}/>
                            </div>
                            <div className='control-item'>
                                <label htmlFor="rightDutyCycle">Duty Cycle (%): {rightDutyCycle}</label>
                                <input id="rightDutyCycle" type='range' min='1' max='100' value={rightDutyCycle}
                                       onChange={handleRightDutyCycleChange}/>
                            </div>
                        </div>
                    </div>

                    <div style={{margin: "1em"}}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <OscillatorTypeButton active={rightOscillatorType === 'sine'} type='sine'
                                                  setOscillatorType={handleRightOscillatorTypeChange}/>
                            <OscillatorTypeButton active={rightOscillatorType === 'square'} type='square'
                                                  setOscillatorType={handleRightOscillatorTypeChange}/>
                            <OscillatorTypeButton active={rightOscillatorType === 'sawtooth'} type='sawtooth'
                                                  setOscillatorType={handleRightOscillatorTypeChange}/>
                            <OscillatorTypeButton active={rightOscillatorType === 'triangle'} type='triangle'
                                                  setOscillatorType={handleRightOscillatorTypeChange}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
