import React from 'react';
import { ColorInfo } from '@/hooks/useColorExtraction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColorDisplayProps {
  color: ColorInfo;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({
  color,
  size = 'medium',
  showDetails = true
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="flex items-center gap-3 p-2">
      <div
        className={`${sizeClasses[size]} rounded-lg border-2 border-gray-200 shadow-sm`}
        style={{ backgroundColor: color.hex }}
        title={`RGB: ${color.rgb.join(', ')}`}
      />
      {showDetails && (
        <div className={`flex flex-col ${textSizeClasses[size]}`}>
          <span className="font-mono font-semibold">{color.hex.toUpperCase()}</span>
          <span className="text-gray-600">RGB({color.rgb.join(', ')})</span>
          {color.percentage > 0 && (
            <span className="text-gray-500">{color.percentage}%</span>
          )}
        </div>
      )}
    </div>
  );
};

interface ColorPaletteProps {
  colors: ColorInfo[];
  title: string;
  maxDisplay?: number;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  title,
  maxDisplay = 10
}) => {
  const displayColors = colors.slice(0, maxDisplay);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {displayColors.map((color, index) => (
            <ColorDisplay
              key={`${color.hex}-${index}`}
              color={color}
              size="medium"
              showDetails={true}
            />
          ))}
        </div>
        {colors.length > maxDisplay && (
          <p className="text-sm text-gray-500 mt-4">
            ... and {colors.length - maxDisplay} more colors
          </p>
        )}
      </CardContent>
    </Card>
  );
};
