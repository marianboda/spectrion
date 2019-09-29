import React, { useRef, useEffect } from 'react';
import { drawSpectrum, clearCanvas } from './DrawUtils';

export const Spectrogram = ({ data }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvasCtx = canvasRef.current.getContext('2d');
        clearCanvas(canvasCtx);
    }, []);

    useEffect(() => {
        if (!data || data.length === 0) return;
        const canvasCtx = canvasRef.current.getContext('2d');
        drawSpectrum(canvasCtx, data[data.length-1], data.length-1);
    }, [data]);

    return (
        <canvas ref={canvasRef} width="800" height="1200" />
    )
}