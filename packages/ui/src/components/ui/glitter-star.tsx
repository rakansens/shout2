import React from "react";

interface GlitterStarProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GlitterStar: React.FC<GlitterStarProps> = ({
  size = 8,
  color = "#ffffff",
  className = "",
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={`animate-pulse ${className}`}
      style={{
        position: "absolute",
        opacity: 0.8,
        ...style,
      }}
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
};
