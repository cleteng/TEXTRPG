import type { ReactNode, CSSProperties } from 'react';
import type { GameModule } from '../engine/types';

interface ThemeRootProps {
  module: GameModule;
  children: ReactNode;
  className?: string;
}

export function ThemeRoot({ module, children, className }: ThemeRootProps) {
  const { palette, narrativeFont } = module;
  const style: CSSProperties = {
    '--th-accent': palette.accent,
    '--th-accent-soft': palette.accentSoft,
    '--th-bg': palette.bg,
    '--th-surface': palette.surface,
    '--th-border': palette.border,
    '--th-text': palette.text,
    '--th-muted': palette.muted,
    '--th-narrative-font': narrativeFont,
    backgroundColor: palette.bg,
    color: palette.text,
  } as CSSProperties;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
