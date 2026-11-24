// Procedural Sound Synthesizer using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = false

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (enabled && !this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        this.ctx = new AudioContextClass()
      } catch (e) {
        console.warn('Web Audio API not supported', e)
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  private initContext() {
    if (!this.ctx && this.enabled) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioContextClass()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public playStep() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const t = this.ctx.currentTime

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, t)
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.05)

    gain.gain.setValueAtTime(0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(t)
    osc.stop(t + 0.06)
  }

  public playSpin() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const t = this.ctx.currentTime

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, t)
    osc.frequency.linearRampToValueAtTime(250, t + 0.35)

    gain.gain.setValueAtTime(0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(t)
    osc.stop(t + 0.36)
  }

  public playCrossover() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const t = this.ctx.currentTime
    const notes = [523.25, 659.25] // C5, E5

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      const startT = t + idx * 0.07

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startT)
      gain.gain.setValueAtTime(0.07, startT)
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.12)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)
      osc.start(startT)
      osc.stop(startT + 0.13)
    })
  }

  public playMutation() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const t = this.ctx.currentTime

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08)

    gain.gain.setValueAtTime(0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(t)
    osc.stop(t + 0.1)
  }

  public playNewBest() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const t = this.ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      const startT = t + idx * 0.08

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startT)
      gain.gain.setValueAtTime(0.1, startT)
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)
      osc.start(startT)
      osc.stop(startT + 0.26)
    })
  }
}

export const sounds = new SoundManager()
