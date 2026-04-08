# Pomodoro CLI

![Node.js](https://img.shields.io/badge/Node.js-16%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-lightgrey?logo=apple&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/PedroLopezJ/PomodoroCLI)
![GitHub last commit](https://img.shields.io/github/last-commit/PedroLopezJ/PomodoroCLI)

A terminal-based Pomodoro timer with ASCII art, color-coded phases, and system notifications.

## Features

- 25-minute work sessions with 5-minute short breaks and 15-minute long breaks
- ASCII tomato art and figlet countdown display
- Color-coded phases (red for work, green for short break, blue for long break)
- Progress bar showing elapsed time
- System sound and alert dialog on phase transitions
- Cross-platform support (macOS and Windows)

## Requirements

- Node.js 16+
- npm

## Installation

```bash
git clone https://github.com/PedroLopezJ/PomodoroCLI.git
cd PomodoroCLI
npm install
```

## Usage

```bash
npm start
```

## Controls

| Key         | Action             |
|-------------|--------------------|
| Enter/Space | Start timer        |
| Space       | Pause / Resume     |
| S           | Skip current phase |
| Q           | Quit               |
| Ctrl+C      | Force quit         |

## How It Works

The timer follows the standard Pomodoro Technique cycle:

1. **Work** - 25 minutes
2. **Short Break** - 5 minutes
3. Repeat steps 1-2 four times
4. **Long Break** - 15 minutes

When each phase ends, a system sound plays and an alert dialog appears to notify you.

## License

MIT
