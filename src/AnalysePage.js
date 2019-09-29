import React, { useState } from 'react';
import { getTrackData } from './AudioUtils';
import { Spectrogram } from './Spectrogram';

export const AnalysePage = props => {
    const [frequencyData, setFrequencyData] = useState([]);

    const handleButtonClick = async () => {
        const trackData = await getTrackData('midnight.mp3');
        setFrequencyData(trackData.frequencyData);
    }

    return (
        <div>
            <h2>Analyse</h2>
            <button onClick={handleButtonClick}>Start</button>
            <div>{frequencyData ? ':)' : '-'}</div>
            <Spectrogram data={frequencyData} />
        </div>
    );
}