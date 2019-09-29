export const fftSize = 8192*2;
export const samplingFrequency = 44100;

export const binToFrequency = i => i * samplingFrequency / fftSize;

const offlineContext = new OfflineAudioContext(1, samplingFrequency*100, samplingFrequency)

export const getTrackData = (url) => {
    return new Promise((resolve, reject) => {
        const analyser = offlineContext.createAnalyser();
        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = fftSize;
    
        const node = offlineContext.createScriptProcessor(fftSize, 1, 1);
        const sourceNode = offlineContext.createBufferSource();
        
        sourceNode.connect(analyser);
        analyser.connect(node);
        node.connect(offlineContext.destination);
        sourceNode.connect(offlineContext.destination);
    
        let frequencyData = [];
        
        const playSound = (buffer) => {
            sourceNode.buffer = buffer;
            sourceNode.start(0);
            offlineContext.startRendering().then(buffer => {
                resolve({ frequencyData, buffer });
            });
        }
    
        const loadSound = (url) => {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
    
            request.onload = () => {    
                offlineContext.decodeAudioData(request.response, buffer => {
                    node.onaudioprocess = () => {
                        const array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        frequencyData = [...frequencyData, array];
                    };
                    playSound(buffer);
                }, e => console.log(e));
            }
            request.send();
        }
    
        loadSound(url);
    })
}