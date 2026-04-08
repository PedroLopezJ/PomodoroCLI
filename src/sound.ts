import { exec } from 'child_process';

function chimeOnce(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'darwin') {
      exec('afplay /System/Library/Sounds/Glass.aiff', () => resolve());
    } else if (process.platform === 'win32') {
      exec(
        'powershell -NoProfile -Command "[System.Media.SystemSounds]::Beep.Play()"',
        () => resolve()
      );
    } else {
      resolve();
    }
  });
}

async function chimeN(times: number): Promise<void> {
  for (let i = 0; i < times; i++) {
    await chimeOnce();
  }
}

function sendAlert(title: string, message: string): void {
  const escaped = (s: string) => s.replace(/"/g, '\\"');
  if (process.platform === 'darwin') {
    exec(
      `osascript -e 'display alert "${escaped(title)}" message "${escaped(message)}"'`
    );
  } else if (process.platform === 'win32') {
    exec(
      `powershell -NoProfile -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${escaped(message)}', '${escaped(title)}')"`,
    );
  }
}

export function playWorkEndChime(): void {
  chimeN(1);
  sendAlert('Pomodoro', 'Work session complete! Time to take a break.');
}

export function playBreakEndChime(): void {
  chimeN(1);
  sendAlert('Pomodoro', 'Break is over! Time to get back to work.');
}
