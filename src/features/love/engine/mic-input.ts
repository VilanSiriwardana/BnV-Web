import { getAudioContext } from './audio-engine';
import { analyseFrame, type BlowFeatures } from './blow-detector';

// ADR-0033: analysed in memory only, never recorded or sent. The analyser is never connected to the
// destination (no feedback). Callers must call stop() on every exit path.
export type MicInput = { read: () => BlowFeatures; stop: () => void };

export async function openMic(): Promise<MicInput> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });
  const shared = getAudioContext();
  let ctx: AudioContext;
  try {
    ctx = shared ?? new AudioContext();
  } catch (e) {
    stream.getTracks().forEach((t) => t.stop());
    throw e;
  }
  if (ctx.state === 'suspended') void ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.2;
  source.connect(analyser);
  const db = new Float32Array(analyser.frequencyBinCount);
  const power = new Float32Array(analyser.frequencyBinCount);
  const time = new Float32Array(analyser.fftSize);
  const binHz = ctx.sampleRate / analyser.fftSize;
  let stopped = false;

  return {
    read() {
      analyser.getFloatFrequencyData(db);
      analyser.getFloatTimeDomainData(time);
      for (let i = 0; i < db.length; i++) power[i] = 10 ** (db[i] / 10);
      return analyseFrame(power, time, binHz);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      stream.getTracks().forEach((t) => t.stop());
      source.disconnect();
      if (!shared) void ctx.close();
    },
  };
}
