import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import "./slidercontrolleddiv.css";

const OscillatorTypeButton = ({ active, type, setOscillatorType }) => {
    const buttonClass = `oscillator-type-button ${active ? "active" : ""}`;
    return React.createElement("button", {
        className: buttonClass,
        onClick: () => setOscillatorType(type)
    }, type);
};

const SliderControlledDiv = () => {
    const [isFlashing, setIsFlashing] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [frequency, setFrequency] = useState(40);
    const [oscillatorType, setOscillatorType] = useState('sine');
    const [oscillator, setOscillator] = useState(null);

    useEffect(() => {
        const osc = new Tone.Oscillator(frequency, oscillatorType).toDestination();
        setOscillator(osc);
        return () => osc.dispose();
    }, [frequency, oscillatorType]);

    useEffect(() => {
        if (oscillator) {
            oscillator.type = oscillatorType;
        }
    }, [oscillatorType, oscillator]);

    useEffect(() => {
        const flashInterval = setInterval(() => {
            setIsFlashing(f => !f);
        }, 1000 / speed);
        return () => clearInterval(flashInterval);
    }, [speed]);

    useEffect(() => {
        if (isFlashing) {
            oscillator?.start();
        } else {
            oscillator?.stop();
        }
    }, [isFlashing, oscillator]);

    useEffect(() => {
        if (oscillator) {
            oscillator.frequency.setValueAtTime(frequency, Tone.now());
        }
    }, [frequency, oscillator]);

    const handleSpeedChange = (e) => {
        setSpeed(Number(e.target.value));
    };

    const handleFrequencyChange = (e) => {
        setFrequency(Number(e.target.value));
    };

    const adjustSpeed = (delta) => {
        setSpeed(prevSpeed => Math.max(0.1, Math.min(5, prevSpeed + delta)));
    };

    const adjustFrequency = (delta) => {
        setFrequency(prevFrequency => Math.max(0, Math.min(120, prevFrequency + delta)));
    };

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

export default SliderControlledDiv;
