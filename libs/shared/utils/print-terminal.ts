import { COLORS } from '../src';

export const centerText = (text: string): string => {
  const terminalWidth = process.stdout.columns || 80;
  const padding = Math.max((terminalWidth - text.length) / 2, 0);
  return ' '.repeat(padding) + text;
};

export const print = (message: string) => {
  const text = `${COLORS.system}${message}${COLORS.reset}`;
  const alignedText = centerText(text);
  process.stdout.write('\n' + alignedText + '\n\n');
};
