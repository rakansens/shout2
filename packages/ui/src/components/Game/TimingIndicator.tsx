'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export type TimingRating = 'perfect' | 'great' | 'good' | 'miss' | null;

export interface TimingIndicatorProps {
  rating: TimingRating;
  showAnimation: boolean;
  className?: string;
}

export const TimingIndicator: React.FC<TimingIndicatorProps> = ({
  rating,
  showAnimation,
  className
}) => {
  // レーティングに基づいて表示テキストとスタイルを決定
  const getRatingDisplay = () => {
    switch (rating) {
      case 'perfect':
        return {
          text: 'PERFECT',
          textColor: 'text-yellow-300',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400'
        };
      case 'great':
        return {
          text: 'GREAT',
          textColor: 'text-green-300',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400'
        };
      case 'good':
        return {
          text: 'GOOD',
          textColor: 'text-blue-300',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-400'
        };
      case 'miss':
        return {
          text: 'MISS',
          textColor: 'text-red-300',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-400'
        };
      default:
        return {
          text: '',
          textColor: '',
          bgColor: '',
          borderColor: ''
        };
    }
  };

  const { text, textColor, bgColor, borderColor } = getRatingDisplay();

  // レーティングがnullの場合は何も表示しない
  if (!rating) {
    return null;
  }

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div 
        className={cn(
          "px-4 py-2 rounded-full border-2 backdrop-blur-sm",
          bgColor,
          borderColor,
          showAnimation && "animate-pulse",
          showAnimation && rating === 'perfect' && "animate-bounce"
        )}
      >
        <span className={cn(
          "font-bold [font-family:'Good_Times-Bold',Helvetica]",
          textColor
        )}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default TimingIndicator;
