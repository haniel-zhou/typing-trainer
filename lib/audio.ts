function buildEnvelope(audioBuffer: AudioBuffer, hopSize = 1024) {
  const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
    audioBuffer.getChannelData(index)
  );
  const frameCount = Math.floor(audioBuffer.length / hopSize);
  const envelope = new Float32Array(frameCount);

  for (let frame = 0; frame < frameCount; frame += 1) {
    let sum = 0;
    const start = frame * hopSize;

    for (let i = 0; i < hopSize; i += 1) {
      let sample = 0;
      for (let channel = 0; channel < channels.length; channel += 1) {
        sample += channels[channel][start + i] ?? 0;
      }
      sample /= channels.length;
      sum += Math.abs(sample);
    }

    envelope[frame] = sum / hopSize;
  }

  const mean = envelope.reduce((acc, value) => acc + value, 0) / Math.max(1, envelope.length);
  for (let i = 0; i < envelope.length; i += 1) {
    envelope[i] = Math.max(0, envelope[i] - mean * 0.92);
  }

  return { envelope, envelopeRate: audioBuffer.sampleRate / hopSize };
}

export function estimateBpm(audioBuffer: AudioBuffer) {
  const { envelope, envelopeRate } = buildEnvelope(audioBuffer);
  let bestBpm = 120;
  let bestScore = -Infinity;

  for (let bpm = 72; bpm <= 180; bpm += 1) {
    const lag = Math.round((60 * envelopeRate) / bpm);
    if (lag <= 0 || lag >= envelope.length) continue;

    let score = 0;
    for (let i = 0; i < envelope.length - lag; i += 1) {
      score += envelope[i] * envelope[i + lag];
    }

    if (score > bestScore) {
      bestScore = score;
      bestBpm = bpm;
    }
  }

  const doubled = bestBpm * 2;
  if (bestBpm < 90 && doubled <= 180) {
    return doubled;
  }

  return bestBpm;
}
