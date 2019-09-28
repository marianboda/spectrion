import React, { useState, useRef } from 'react';
import { fftSize } from './AudioUtils';
import { drawSpectrum, clearCanvas } from './DrawUtils';

export const AnalysePage = props => {
    const canvasRef = useRef(null);
    const [audioCtx] = useState(new OfflineAudioContext(1, 4410000, 44100));
    
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

        const canvasCtx = canvasRef.current.getContext('2d');
        
        const playSound = (buffer) => {
            sourceNode.buffer = buffer;
            sourceNode.start(0);
            audioCtx.startRendering().then(rendered => console.log(rendered));
        }
    
        const loadSound = (url) => {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
    
            request.onload = () => {
                clearCanvas(canvasCtx);
    
                audioCtx.decodeAudioData(request.response, buffer => {
                    let time = 0;
                    node.onaudioprocess = () => {
                        var array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        drawSpectrum(canvasCtx, array, time);
                        time += 1;
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
            <canvas ref={canvasRef} width="1600" height="1200" />
        </div>
    );
}