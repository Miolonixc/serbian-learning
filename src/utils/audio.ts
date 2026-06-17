export function speak(text: string, lang: string = 'sr-RS'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

export function playCorrectSound(): void {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 523.25;
  gain.gain.value = 0.3;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.stop(ctx.currentTime + 0.3);
}

export function playWrongSound(): void {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 200;
  gain.gain.value = 0.3;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.stop(ctx.currentTime + 0.5);
}
