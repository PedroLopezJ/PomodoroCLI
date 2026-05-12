import chalk from 'chalk';
import figlet from 'figlet';
import { Phase, TimerState } from './timer';

const PHASE_COLORS: Record<Phase, chalk.Chalk> = {
  'work': chalk.red,
  'short-break': chalk.green,
  'long-break': chalk.blue,
};

const PHASE_LABELS: Record<Phase, string> = {
  'work': 'WORK',
  'short-break': 'SHORT BREAK',
  'long-break': 'LONG BREAK',
};

let headerRendered = false;
let cachedHeader = '';

function renderHeader(): string {
  if (!headerRendered) {
    cachedHeader = figlet.textSync('POMODORO', { font: 'Big' });
    headerRendered = true;
  }
  return chalk.magentaBright(cachedHeader);
}

function renderTomato(): string {
  const leaf   = chalk.greenBright;
  const stem   = chalk.green;
  const body   = chalk.redBright;
  const shade  = chalk.hex('#8B0000');
  const shine  = chalk.yellowBright;
  const eyes   = chalk.white;
  const blush  = chalk.hex('#ff69b4');
  const mouth  = chalk.hex('#a00000');
  const tongue = chalk.hex('#ffb6c1');

  return [
    '       ' + leaf('\\\\|//')  + '       ',
    '      ' + stem('__\\|/__') + '      ',
    '    ' + body(".'") + '   ' + stem('|') + '   ' + body("'.") + '    ',
    '   ' + body('/')  + '     ' + shine('✦') + '     ' + body('\\') + '   ',
    '  ' + body('/')  + '   ' + eyes('◠') + '     ' + eyes('◠') + '   ' + body('\\') + '  ',
    ' '  + body('|')  + ' '   + blush('♥') + '           ' + blush('♥') + ' ' + body('|') + ' ',
    ' '  + body('|')  + '     ' + mouth('\\___/') + '     ' + body('|') + ' ',
    '  ' + body('\\') + '     ' + tongue('‿‿‿') + '     ' + body('/') + '  ',
    '   ' + shade('\\') + '           ' + shade('/')  + '   ',
    '    ' + shade("'.") + '       ' + shade(".'") + '    ',
    '      ' + shade("'-___-'") + '      ',
  ].join('\n');
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderCountdown(seconds: number, phase: Phase): string {
  const color = PHASE_COLORS[phase];
  const timeStr = figlet.textSync(formatTime(seconds), { font: 'Big' });
  return color(timeStr);
}

function renderProgressBar(secondsLeft: number, totalSeconds: number): string {
  const cols = process.stdout.columns || 80;
  const barWidth = Math.min(cols - 4, 60);
  const elapsed = totalSeconds - secondsLeft;
  const filled = Math.round((elapsed / totalSeconds) * barWidth);
  const empty = barWidth - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return chalk.gray(`[${bar}]`);
}

function renderStatus(state: TimerState): string {
  const workNum = state.phase === 'work' ? state.pomodoroCount + 1 : state.pomodoroCount;
  const pomodoroPart = `Pomodoro ${Math.min(workNum, 4)}/4`;
  const statusPart = state.isPaused ? chalk.yellow('[PAUSED]') : '';
  const controls = chalk.gray('[SPACE] pause  [S] skip  [Q] quit');
  return `${chalk.cyan(pomodoroPart)}  ${statusPart}  ${controls}`;
}

function centerText(text: string): string {
  const cols = process.stdout.columns || 80;
  return text
    .split('\n')
    .map((line) => {
      const visible = line.replace(/\x1b\[[0-9;]*m/g, '');
      const pad = Math.max(0, Math.floor((cols - visible.length) / 2));
      return ' '.repeat(pad) + line;
    })
    .join('\n');
}

export function renderStartScreen(): void {
  const output = [
    '\x1b[2J\x1b[H',
    centerText(renderHeader()),
    '\n',
    centerText(renderTomato()),
    '\n\n',
    centerText(chalk.gray('────────────────────────────────────')),
    centerText(chalk.whiteBright('  Press ') + chalk.cyanBright('[ENTER]') + chalk.whiteBright(' or ') + chalk.cyanBright('[SPACE]') + chalk.whiteBright(' to start')),
    centerText(chalk.gray('  [Q] quit')),
    centerText(chalk.gray('────────────────────────────────────')),
    '\n',
  ].join('\n');
  process.stdout.write(output);
}

export function render(state: TimerState, totalSeconds: number): void {
  const phaseColor = PHASE_COLORS[state.phase];
  const phaseLabel = phaseColor.bold(`\n  ── ${PHASE_LABELS[state.phase]} ──\n`);
  const countdown = renderCountdown(state.secondsLeft, state.phase);
  const progress = renderProgressBar(state.secondsLeft, totalSeconds);
  const status = renderStatus(state);

  const output = [
    '\x1b[2J\x1b[H', // clear screen, move cursor to top
    centerText(renderHeader()),
    phaseLabel,
    centerText(countdown),
    '\n',
    centerText(progress),
    '\n',
    '  ' + status,
    '\n',
  ].join('\n');

  process.stdout.write(output);
}

export function renderQuit(): void {
  process.stdout.write('\x1b[2J\x1b[H');
  console.log(chalk.magentaBright('\nGoodbye! Great work today.\n'));
}
