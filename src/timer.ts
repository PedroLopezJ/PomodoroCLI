import { EventEmitter } from 'events';

export type Phase = 'work' | 'short-break' | 'long-break';

export interface TimerState {
  phase: Phase;
  pomodoroCount: number;
  secondsLeft: number;
  isPaused: boolean;
  isRunning: boolean;
}

const DURATIONS: Record<Phase, number> = {
  'work': 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

export class PomodoroTimer extends EventEmitter {
  private state: TimerState;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.state = {
      phase: 'work',
      pomodoroCount: 0,
      secondsLeft: DURATIONS['work'],
      isPaused: false,
      isRunning: false,
    };
  }

  getState(): Readonly<TimerState> {
    return { ...this.state };
  }

  getDuration(): number {
    return DURATIONS[this.state.phase];
  }

  start(): void {
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.tick();
  }

  pause(): void {
    if (!this.state.isRunning) return;
    this.state.isPaused = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.emit('update', this.getState());
  }

  resume(): void {
    if (!this.state.isRunning || !this.state.isPaused) return;
    this.state.isPaused = false;
    this.tick();
  }

  skip(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.advancePhase();
  }

  quit(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.state.isRunning = false;
    this.emit('quit');
  }

  private tick(): void {
    this.emit('update', this.getState());
    this.interval = setInterval(() => {
      if (this.state.secondsLeft <= 0) {
        clearInterval(this.interval!);
        this.interval = null;
        this.emit('phase-complete', this.getState());
        setTimeout(() => this.advancePhase(), 1000);
        return;
      }
      this.state.secondsLeft--;
      this.emit('update', this.getState());
    }, 1000);
  }

  private advancePhase(): void {
    if (this.state.phase === 'work') {
      this.state.pomodoroCount++;
      if (this.state.pomodoroCount % 4 === 0) {
        this.state.phase = 'long-break';
      } else {
        this.state.phase = 'short-break';
      }
    } else {
      this.state.phase = 'work';
    }
    this.state.secondsLeft = DURATIONS[this.state.phase];
    this.state.isRunning = false;
    this.emit('phase-change', this.getState());
  }
}
