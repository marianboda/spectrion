import React, { useState } from 'react';
import { fftSize, samplingFrequency } from './AudioUtils';
import { Spectrogram } from './Spectrogram';

export const AnalysePage = props => {
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [frequencyData, setFrequencyData] = useState([]);
    const [audioCtx] = useState(
        new OfflineAudioContext(1, samplingFrequency*100, samplingFrequency)
    );
    
    const addFrequencyData = (data) => setFrequencyData(prev => [...prev, data]);

    const handleButtonClick = () => {
        const analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = fftSize; 

        const node = audioCtx.createScriptProcessor(fftSize, 1, 1);
        const sourceNode = audioCtx.createBufferSource();
        
        sourceNode.connect(analyser);
        analyser.connect(node);
        node.connect(audioCtx.destination);
        sourceNode.connect(audioCtx.destination);
        
        const playSound = (buffer) => {
            sourceNode.buffer = buffer;
            sourceNode.start(0);
            audioCtx.startRendering().then(buffer => {
                setAudioBuffer(buffer)
                console.log('audio', audioBuffer)
            });
        }
    
        const loadSound = (url) => {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
    
            request.onload = () => {    
                audioCtx.decodeAudioData(request.response, buffer => {

                    node.onaudioprocess = () => {
                        var array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        addFrequencyData(array);
                    }
                    playSound(buffer);
                }, e => console.log(e));
            }
            request.send();
        }
    
        loadSound("midnight.mp3");
    }

    return (
        <div>
            <h2>Analyse</h2>
            <button onClick={handleButtonClick}>Start</button>
            <div>{audioBuffer ? ':)' : '-'}</div>
            <Spectrogram data={frequencyData} />
        </div>
    );
}