import { binToFrequency } from './AudioUtils';

export const frequencyToY = (f) => 1200 - (Math.log2(f) - 4) * 180;

export const drawC = (canvasCtx, n) => {
    const cs = [
        16.35,
        32.7,
        65.41,
        130.81,
        261.63,
        523.25,
        1046.5,
        2093,
        3135.96,
        6271.93,
    ]
    const y = frequencyToY(cs[n]);
    canvasCtx.strokeStyle='#FF0000';
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, y);
    canvasCtx.lineTo(1600, y);
    canvasCtx.stroke(); 
}

export const drawSpectrum = (canvasCtx, array, time) => {
    for (let i = 0; i < array.length; i++){
        const value = array[i];
        const d = Math.max(0, Math.min(254, value));
        const hex = d.toString(16).padStart(2, '0');
        canvasCtx.fillStyle = `#${hex}${hex}${hex}`;

        const y = frequencyToY(binToFrequency(i))
        const h = Math.max(1, frequencyToY(binToFrequency(i-1)) - y)

        canvasCtx.fillRect(time, y, 1, h);
        canvasCtx.fillStyle = '#000000';
    }
}

export const clearCanvas = (canvasCtx) => {
    canvasCtx.fillStyle = `#000000`;
    canvasCtx.fillRect(0, 0, 1600, 1200);
    drawC(canvasCtx, 2);
    drawC(canvasCtx, 3);
    drawC(canvasCtx, 4);
    drawC(canvasCtx, 5);
    drawC(canvasCtx, 6);
}
