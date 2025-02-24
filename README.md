SliderControlledDiv

Overview

SliderControlledDiv is a React-based interactive audio-visual application that integrates Tone.js for audio synthesis and visual effects. The application allows users to manipulate oscillators and visual elements using sliders and buttons, offering a dynamic experience in adjusting frequency, duty cycles, and oscillator types.

Features

Audio Oscillators: Generates stereo sound using two independent oscillators (left and right).

Visual Feedback: A flashing background that synchronizes with the oscillator's speed.

Adjustable Parameters:

Speed: Controls the rate of flashing and audio pulses.

Frequency: Sets the pitch of the oscillators (0–2000 Hz).

Duty Cycle: Defines the proportion of time the oscillator is active within a cycle.

Oscillator Type: Choose between sine, square, sawtooth, and triangle waveforms.


Real-time Updates: Changes apply instantly to both sound and visuals.

Interactive UI: Intuitive sliders and buttons for easy parameter tuning.


Technologies Used

React – For UI and state management.

Tone.js – For audio synthesis.

CSS – For styling and visual effects.


Usage

1. Start the application:

Click the Start Audio button to initialize sound output.



2. Adjust the settings:

Use sliders to modify speed, frequency, and duty cycles.

Select different oscillator types for unique sound variations.



3. Observe the visual feedback:

The background flashes in sync with the oscillator activity.




Installation

1. Clone the repository:

git clone https://github.com/your-repository.git


2. Install dependencies:

npm install


3. Start the development server:

npm run dev



License

This project is licensed under the MIT License.