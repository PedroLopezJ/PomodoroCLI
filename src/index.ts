import * as readline from 'readline';
import { PomodoroTimer } from './timer';
import { render, renderQuit, renderStartScreen } from './ui';
import { playWorkEndChime, playBreakEndChime } from './sound';

const timer = new PomodoroTimer();
let started = false;

// Set up raw keyboard input
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
process.stdin.resume();

process.stdin.on('keypress', (_str, key) => {
  if (!key) return;

  if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
    if (started) {
      timer.quit();
    } else {
      renderQuit();
      process.stdin.setRawMode(false);
      process.exit(0);
    }
    return;
  }

  if (!started) {
    if (key.name === 'return' || key.name === 'space') {
      started = true;
      timer.start();
    }
    return;
  }

  if (key.name === 'space') {
    const state = timer.getState();
    if (state.isPaused) {
      timer.resume();
    } else {
      timer.pause();
    }
  } else if (key.name === 's') {
    timer.skip();
  }
});

timer.on('update', (state) => {
  render(state, timer.getDuration());
});

timer.on('phase-complete', (state) => {
  if (state.phase === 'work') {
    playWorkEndChime();   // 2 chimes: work session done, time to rest
  } else {
    playBreakEndChime();  // 4 chimes: break done, back to work
  }
  render(state, timer.getDuration());
});

timer.on('phase-change', (state) => {
  started = false;
  render(state, timer.getDuration());
});

timer.on('quit', () => {
  renderQuit();
  process.stdin.setRawMode(false);
  process.exit(0);
});

renderStartScreen();
