'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface GameScoreProps {
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  className?: string;
}

export const GameScore: React.FC<GameScoreProps> = ({
  score,
  combo,
  maxCombo,
  accuracy,
  className
}) => {
  // スコアの表示形式を整える（例: 12345 -> 12,345）
  const formattedScore = score.toLocaleString();
  
  // 精度を百分率で表示（例: 0.9756 -> 97.56%）
  const formattedAccuracy = (accuracy * 100).toFixed(2) + '%';

  return (
    <div className={cn("bg-black/50 backdrop-blur-md rounded-lg p-4 text-white", className)}>
      <div className="flex flex-col items-center">
        {/* スコア */}
        <div className="text-center mb-2">
          <div className="text-sm [font-family:'Good_Times-Light',Helvetica] font-light text-gray-300">SCORE</div>
          <div className="text-4xl [font-family:'Good_Times-Bold',Helvetica] font-bold">{formattedScore}</div>
        </div>
        
        {/* コンボと精度 */}
        <div className="flex justify-between w-full">
          <div className="text-center">
            <div className="text-xs [font-family:'Good_Times-Light',Helvetica] font-light text-gray-300">COMBO</div>
            <div className="text-xl [font-family:'Good_Times-Regular',Helvetica] font-normal">
              <span className={combo > 0 ? "text-yellow-400" : ""}>{combo}</span>
              <span className="text-sm text-gray-400"> / {maxCombo}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs [font-family:'Good_Times-Light',Helvetica] font-light text-gray-300">ACCURACY</div>
            <div className="text-xl [font-family:'Good_Times-Regular',Helvetica] font-normal">
              {formattedAccuracy}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScore;
