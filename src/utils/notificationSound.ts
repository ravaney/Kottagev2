let audioContext: AudioContext | null = null;
let unlockListenersAttached = false;
let audioUnlocked = false;

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextConstructor();
  }

  return audioContext;
};

const unlockAudio = async () => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch (error) {
      console.warn('Unable to resume notification audio context:', error);
      return;
    }
  }

  audioUnlocked = context.state === 'running';
};

export const primeNotificationSound = () => {
  if (typeof window === 'undefined' || unlockListenersAttached) {
    return;
  }

  const handleFirstInteraction = () => {
    void unlockAudio();
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
    unlockListenersAttached = false;
  };

  unlockListenersAttached = true;
  window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
  window.addEventListener('keydown', handleFirstInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstInteraction, { once: true });
};

export const playNotificationSound = async () => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (!audioUnlocked || context.state !== 'running') {
    await unlockAudio();
  }

  if (context.state !== 'running') {
    return;
  }

  const now = context.currentTime;
  const masterGain = context.createGain();
  masterGain.connect(context.destination);
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  const frequencies = [740, 988, 1174];

  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = now + index * 0.09;
    const endTime = startTime + 0.2;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.connect(gain);
    gain.connect(masterGain);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.7, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
};
