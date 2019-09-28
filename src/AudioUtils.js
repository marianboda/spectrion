export const fftSize = 8192*2;
export const samplingFrequency = 44100;

export const binToFrequency = i => i * samplingFrequency / fftSize;
