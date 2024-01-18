import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import "./slidercontrolleddiv.css";

// Component for oscillator type selection button
const OscillatorTypeButton = ({ active, type, setOscillatorType }) => {
    // Class name changes based on whether the button is active
    const buttonClass = `oscillator-type-button ${active ? "active" : ""}`;
    return React.createElement("button", {
        className: buttonClass,
        onClick: () => setOscillatorType(type)
    }, type);
};

// Main component controlling oscillator and flashing div
const PetenSliderControlledDiv = () => {
    // State for flashing effect, speed, frequency, oscillator type, and the oscillator object
    const [isFlashing, setIsFlashing] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [frequency, setFrequency] = useState(40);
    const [oscillatorType, setOscillatorType] = useState('sine');
    const [oscillator, setOscillator] = useState(null);

    // Effect for initializing and cleaning up the oscillator
    useEffect(() => {
        const osc = new Tone.Oscillator(frequency, oscillatorType).toDestination();
        setOscillator(osc);
        return () => osc.dispose();
    }, [frequency, oscillatorType]);

    // Effect for updating oscillator type
    useEffect(() => {
        if (oscillator) {
            oscillator.type = oscillatorType;
        }
    }, [oscillatorType, oscillator]);

    // Effect for toggling flashing state at a speed determined by `speed`
    useEffect(() => {
        const flashInterval = setInterval(() => {
            setIsFlashing(f => !f);
        }, 1000 / speed);
        return () => clearInterval(flashInterval);
    }, [speed]);

    // Effect for starting or stopping the oscillator based on flashing state
    useEffect(() => {
        if (isFlashing) {
            oscillator?.start();
        } else {
            oscillator?.stop();
        }
    }, [isFlashing, oscillator]);

    // Effect for setting oscillator frequency
    useEffect(() => {
        if (oscillator) {
            oscillator.frequency.setValueAtTime(frequency, Tone.now());
        }
    }, [frequency, oscillator]);

    // Handlers for changing speed and frequency
    const handleSpeedChange = (e) => {
        setSpeed(Number(e.target.value));
    };

    const handleFrequencyChange = (e) => {
        setFrequency(Number(e.target.value));
    };

    // Functions to increment/decrement speed and frequency
    const adjustSpeed = (delta) => {
        setSpeed(prevSpeed => Math.max(0.1, Math.min(5, prevSpeed + delta)));
    };

    const adjustFrequency = (delta) => {
        setFrequency(prevFrequency => Math.max(0, Math.min(120, prevFrequency + delta)));
    };

    // Rendering the main component
    return React.createElement("div", { className: "slider-controlled-div" },
        React.createElement("div", {
            className: "flashing-div",
            style: { backgroundColor: isFlashing ? 'black' : 'white' }
        }),
        React.createElement("div", { className: "controls" },
            React.createElement("button", { className: "button", onClick: () => adjustSpeed(-0.1) }, "-"),
            React.createElement("input", {
                className: "slider",
                type: "range",
                min: "0",
                max: "5",
                step: "0.1",
                value: speed,
                onChange: handleSpeedChange
            }),
            React.createElement("button", { className: "button", onClick: () => adjustSpeed(0.1) }, "+"),
            React.createElement("label", null, `Speed: ${speed.toFixed(1)}`),
            React.createElement("br"),
            React.createElement("button", { className: "button", onClick: () => adjustFrequency(-1) }, "-"),
            React.createElement("input", {
                className: "slider",
                type: "range",
                min: "0",
                max: "120",
                value: frequency,
                onChange: handleFrequencyChange
            }),
            React.createElement("button", { className: "button", onClick: () => adjustFrequency(1) }, "+"),
            React.createElement("label", null, `Frequency (Hz): ${frequency}`),
            // Rendering OscillatorTypeButtons for each type
            React.createElement("div", {
                    style: { display: 'flex', justifyContent: 'center', margin: '20px 0' }
                },
                React.createElement(OscillatorTypeButton, { active: oscillatorType === "sine", type: "sine", setOscillatorType: setOscillatorType }),
                React.createElement(OscillatorTypeButton, { active: oscillatorType === "square", type: "square", setOscillatorType: setOscillatorType }),
                React.createElement(OscillatorTypeButton, { active: oscillatorType === "sawtooth", type: "sawtooth", setOscillatorType: setOscillatorType }),
                React.createElement(OscillatorTypeButton, { active: oscillatorType === "triangle", type: "triangle", setOscillatorType: setOscillatorType })
            )
        )
    );
};

export default PetenSliderControlledDiv;
