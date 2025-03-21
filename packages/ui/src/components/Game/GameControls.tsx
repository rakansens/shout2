'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { PauseIcon, PlayIcon, XIcon, SettingsIcon, HomeIcon } from 'lucide-react';

export interface GameControlsProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onSettings?: () => void;
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  onPause,
  onResume,
  onExit,
  onSettings,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {/* 一時停止/再開ボタン */}
      <button
        onClick={isPaused ? onResume : onPause}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label={isPaused ? "Resume game" : "Pause game"}
      >
        {isPaused ? (
          <PlayIcon className="w-6 h-6 text-white" />
        ) : (
          <PauseIcon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* 設定ボタン（オプション） */}
      {onSettings && (
        <button
          onClick={onSettings}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Game settings"
        >
          <SettingsIcon className="w-6 h-6 text-white" />
        </button>
      )}

      {/* 終了ボタン */}
      <button
        onClick={onExit}
        className="w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center hover:bg-red-500/30 transition-colors"
        aria-label="Exit game"
      >
        <XIcon className="w-6 h-6 text-white" />
      </button>

      {/* 一時停止中のみ表示されるホームボタン */}
      {isPaused && (
        <button
          onClick={onExit}
          className="w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center hover:bg-blue-500/30 transition-colors"
          aria-label="Return to home"
        >
          <HomeIcon className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default GameControls;
