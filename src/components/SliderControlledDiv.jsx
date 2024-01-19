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
    const [leftOscillatorType, setLeftOscillatorType] = useState('sine');
    const [rightOscillatorType, setRightOscillatorType] = useState('sine');
    const [leftFrequency, setLeftFrequency] = useState(500);
    const [rightFrequency, setRightFrequency] = useState(500);
    const [leftOscillator, setLeftOscillator] = useState(null);
    const [rightOscillator, setRightOscillator] = useState(null);
    const [visualActive, setVisualActive] = useState(false);

    // Refs for tracking oscillator states
    const oscillatorsRef = useRef({ left: false, right: false });

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

    const playOscillator = (oscillator, dutyCycle, side) => {
        if (oscillatorsRef.current[side]) return;

        oscillatorsRef.current[side] = true;
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            oscillatorsRef.current[side] = false;
        }, (1000 / speed) * (dutyCycle / 100));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setVisualActive(prev => !prev);
            if (visualActive) {
                playOscillator(leftOscillator, leftDutyCycle, 'left');
                playOscillator(rightOscillator, rightDutyCycle, 'right');
            }
        }, 1000 / speed);

        return () => {
            clearInterval(interval);
        };
    }, [speed, leftDutyCycle, rightDutyCycle, leftOscillator, rightOscillator, visualActive]);

    const handleSpeedChange = (e) => setSpeed(Number(e.target.value));
    const handleLeftDutyCycleChange = (e) => setLeftDutyCycle(Number(e.target.value));
    const handleRightDutyCycleChange = (e) => setRightDutyCycle(Number(e.target.value));
    const handleLeftFrequencyChange = (e) => setLeftFrequency(Number(e.target.value));
    const handleRightFrequencyChange = (e) => setRightFrequency(Number(e.target.value));

    // Render the component
    return (
        <div className='slider-controlled-div'>
            <button onClick={() => Tone.start()}>Start Audio</button>
            <div className='flashing-div' style={{backgroundColor: visualActive ? 'black' : 'white'}}></div>
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
