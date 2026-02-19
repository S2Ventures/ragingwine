// ---------------------------------------------------------------------------
// Simple structured logger for pipeline runs
// ---------------------------------------------------------------------------

type Level = 'info' | 'warn' | 'error' | 'debug';

const COLORS: Record<Level, string> = {
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // yellow
  error: '\x1b[31m',  // red
  debug: '\x1b[90m',  // gray
};
const RESET = '\x1b[0m';

function ts(): string {
  return new Date().toISOString();
}

function emit(level: Level, stage: string, msg: string, data?: unknown) {
  const prefix = `${COLORS[level]}[${level.toUpperCase()}]${RESET} ${ts()} [${stage}]`;
  if (data !== undefined) {
    console.log(`${prefix} ${msg}`, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  } else {
    console.log(`${prefix} ${msg}`);
  }
}

export function createLogger(stage: string) {
  return {
    info: (msg: string, data?: unknown) => emit('info', stage, msg, data),
    warn: (msg: string, data?: unknown) => emit('warn', stage, msg, data),
    error: (msg: string, data?: unknown) => emit('error', stage, msg, data),
    debug: (msg: string, data?: unknown) => emit('debug', stage, msg, data),
  };
}
