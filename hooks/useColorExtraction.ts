// @ts-expect-error ColorThief doesn't have proper TypeScript definitions
import ColorThief from 'colorthief';
import { useState, useCallback } from 'react';

export interface ColorInfo {
  rgb: [number, number, number];
  hex: string;
  percentage: number;
}

export interface ColorAnalysis {
  dominantColor: ColorInfo;
  palette: ColorInfo[];
  totalColors: number;
  uniqueColors: ColorInfo[];
  isSpotColor: boolean;
  spotColorCount: number;
  imageType: 'spot-color' | 'gradient' | 'full-color';
}

export const useColorExtraction = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ColorAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rgbToHex = (rgb: [number, number, number]): string => {
    return "#" + rgb.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };
  const analyzeImage = useCallback(async (imageFile: File, isSimplified: boolean = false): Promise<ColorAnalysis | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            
            // Get dominant color
            const dominantRgb = colorThief.getColor(img) as [number, number, number];
            
            // Get color palette (top 10 colors)
            const paletteRgb = colorThief.getPalette(img, 10) as [number, number, number][];
            
            // Create canvas to analyze all pixels for unique color count
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
              // Count unique colors
            const uniqueColorsSet = new Set<string>();
            const colorFrequency = new Map<string, number>();
            
            for (let i = 0; i < pixels.length; i += 4) {
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const colorKey = `${r},${g},${b}`;
              uniqueColorsSet.add(colorKey);
              colorFrequency.set(colorKey, (colorFrequency.get(colorKey) || 0) + 1);
            }            // Enhanced color grouping with improved algorithms for spot color detection
            const groupSimilarColors = (colors: Set<string>, tolerance: number = 20) => {
              const colorGroups: { colors: string[], frequency: number, representative: string }[] = [];
              const processedColors = new Set<string>();
              
              // Sort colors by frequency for better grouping
              const sortedColors = Array.from(colors).sort((a, b) => {
                const freqA = colorFrequency.get(a) || 0;
                const freqB = colorFrequency.get(b) || 0;
                return freqB - freqA; // Most frequent first
              });
              
              for (const colorStr of sortedColors) {
                if (processedColors.has(colorStr)) continue;
                
                const [r, g, b] = colorStr.split(',').map(Number);
                const frequency = colorFrequency.get(colorStr) || 0;
                const group = { 
                  colors: [colorStr], 
                  frequency, 
                  representative: colorStr 
                };
                processedColors.add(colorStr);
                
                // Find similar colors using improved distance calculation
                for (const otherColorStr of sortedColors) {
                  if (processedColors.has(otherColorStr)) continue;
                  
                  const [r2, g2, b2] = otherColorStr.split(',').map(Number);
                  
                  // Use weighted Euclidean distance (human eye is more sensitive to green)
                  const distance = Math.sqrt(
                    0.3 * Math.pow(r - r2, 2) + 
                    0.59 * Math.pow(g - g2, 2) + 
                    0.11 * Math.pow(b - b2, 2)
                  );
                  
                  if (distance <= tolerance) {
                    group.colors.push(otherColorStr);
                    group.frequency += colorFrequency.get(otherColorStr) || 0;
                    processedColors.add(otherColorStr);
                  }
                }
                
                colorGroups.push(group);
              }
                // Sort groups by frequency (most prominent first)
              colorGroups.sort((a, b) => b.frequency - a.frequency);
              
              return colorGroups;
            };

            // Advanced background detection to filter out background colors
            const detectBackgroundColors = () => {
              const backgroundColors = new Set<string>();
              const borderWidth = Math.min(10, Math.floor(canvas.width * 0.05));
              const totalBorderPixels = (canvas.width * borderWidth * 2) + (canvas.height * borderWidth * 2) - (borderWidth * borderWidth * 4);
              const borderColorCount = new Map<string, number>();
              
              // Sample border pixels to identify background colors
              for (let x = 0; x < canvas.width; x++) {
                for (let y = 0; y < borderWidth; y++) {
                  // Top border
                  const topIndex = (y * canvas.width + x) * 4;
                  const topColor = `${pixels[topIndex]},${pixels[topIndex + 1]},${pixels[topIndex + 2]}`;
                  borderColorCount.set(topColor, (borderColorCount.get(topColor) || 0) + 1);
                  
                  // Bottom border
                  const bottomY = canvas.height - 1 - y;
                  const bottomIndex = (bottomY * canvas.width + x) * 4;
                  const bottomColor = `${pixels[bottomIndex]},${pixels[bottomIndex + 1]},${pixels[bottomIndex + 2]}`;
                  borderColorCount.set(bottomColor, (borderColorCount.get(bottomColor) || 0) + 1);
                }
              }
              
              for (let y = borderWidth; y < canvas.height - borderWidth; y++) {
                for (let x = 0; x < borderWidth; x++) {
                  // Left border
                  const leftIndex = (y * canvas.width + x) * 4;
                  const leftColor = `${pixels[leftIndex]},${pixels[leftIndex + 1]},${pixels[leftIndex + 2]}`;
                  borderColorCount.set(leftColor, (borderColorCount.get(leftColor) || 0) + 1);
                  
                  // Right border
                  const rightX = canvas.width - 1 - x;
                  const rightIndex = (y * canvas.width + rightX) * 4;
                  const rightColor = `${pixels[rightIndex]},${pixels[rightIndex + 1]},${pixels[rightIndex + 2]}`;
                  borderColorCount.set(rightColor, (borderColorCount.get(rightColor) || 0) + 1);
                }
              }
              
              // Colors that appear in >30% of border pixels are likely background
              const backgroundThreshold = totalBorderPixels * 0.3;
              for (const [color, count] of borderColorCount) {
                if (count > backgroundThreshold) {
                  backgroundColors.add(color);
                }
              }
                return backgroundColors;
            };

            // Detect potential background colors
            const backgroundColors = detectBackgroundColors();

            // Smart color grouping for both original and simplified images
            // Group similar colors to handle anti-aliasing and compression artifacts
            let imageType: 'spot-color' | 'gradient' | 'full-color';
            let isSpotColor = false;
            let spotColorCount = 0;
              if (isSimplified) {
              // For simplified images, be more lenient and don't filter background colors
              // since simplification should have already handled the color reduction properly
              const colorGroups = groupSimilarColors(uniqueColorsSet, 30);
              const effectiveColorCount = colorGroups.length;
              
              console.log('Simplified image analysis:', {
                totalUniqueColors: uniqueColorsSet.size,
                colorGroups: effectiveColorCount,
                firstFewColors: Array.from(uniqueColorsSet).slice(0, 10),
                backgroundColorsDetected: backgroundColors.size,
                backgroundColors: Array.from(backgroundColors).slice(0, 3)
              });
              
              // Always accept simplified images as spot color since they were intentionally simplified
              imageType = 'spot-color';
              isSpotColor = true;
              spotColorCount = Math.min(effectiveColorCount, 2);            } else {
              // For original images, be careful with background filtering
              // Don't filter if it would leave us with too few colors for analysis
              const nonBackgroundColors = new Set<string>();
              for (const color of uniqueColorsSet) {
                if (!backgroundColors.has(color)) {
                  nonBackgroundColors.add(color);
                }
              }
                // Special handling for white backgrounds in logos
              // For spot color logos, we need to count a white background as one of the colors
              let colorsToAnalyze = uniqueColorsSet;
              
              // Check if any background color is white or very light
              let hasWhiteBackground = false;
              
              for (const bgColor of backgroundColors) {
                // Check if color is white or very light (all RGB values > 240)
                const [r, g, b] = bgColor.split(',').map(Number);
                if (r > 240 && g > 240 && b > 240) {
                  hasWhiteBackground = true;
                  break;
                }
              }
              
              // Special handling for 1-2 color logos with white background
              if (hasWhiteBackground && nonBackgroundColors.size <= 2) {
                // This is likely a logo with 1-2 colors on white background
                // Treat white as one of the actual colors
                colorsToAnalyze = uniqueColorsSet;
                console.log(`Logo detection: Counting white background as a spot color`);
              } 
              else if (nonBackgroundColors.size >= 2 && backgroundColors.size > 0) {
                // For other cases, filter background if it's clearly just a background
                const totalPixels = canvas.width * canvas.height;
                let shouldFilterBackground = true;
                
                for (const bgColor of backgroundColors) {
                  const bgFrequency = colorFrequency.get(bgColor) || 0;
                  const bgPercentage = bgFrequency / totalPixels;
                  
                  // If background color is between 10-80%, it might be a design element
                  if (bgPercentage >= 0.1 && bgPercentage <= 0.8) {
                    shouldFilterBackground = false;
                    console.log(`Keeping potential background color ${bgColor} (${(bgPercentage * 100).toFixed(1)}%) as it may be a design element`);
                    break;
                  }
                }
                
                if (shouldFilterBackground) {
                  colorsToAnalyze = nonBackgroundColors;
                  console.log(`Filtered out ${backgroundColors.size} background colors`);
                }
              }
              
              const colorGroups = groupSimilarColors(colorsToAnalyze, 85); // Very high tolerance for original images
              const effectiveColorCount = colorGroups.length;console.log('Original image analysis:', {
                totalUniqueColors: uniqueColorsSet.size,
                backgroundColors: backgroundColors.size,
                colorsAfterBackgroundFilter: colorsToAnalyze.size,
                colorGroups: effectiveColorCount,
                firstFewColors: Array.from(uniqueColorsSet).slice(0, 10),
                groupSizes: colorGroups.map(group => group.colors.length),
                groupFrequencies: colorGroups.map(group => group.frequency)
              });
                if (effectiveColorCount === 1) {
                // Single effective color - valid spot color
                imageType = 'spot-color';
                isSpotColor = true;
                spotColorCount = 1;
              } else if (effectiveColorCount === 2) {
                // Quality assessment for 2-color images
                const dominantGroups = colorGroups.slice(0, 2);
                const totalFrequency = dominantGroups.reduce((sum, group) => sum + group.frequency, 0);
                const dominanceRatio = dominantGroups[0].frequency / totalFrequency;
                
                // Check if the two colors have reasonable distribution (not too imbalanced)
                // This helps distinguish logos from images that just happen to have 2 dominant colors
                if (dominanceRatio <= 0.95) {
                  // Exactly 2 effective colors with good distribution - valid spot color
                  imageType = 'spot-color';
                  isSpotColor = true;
                  spotColorCount = 2;
                } else {
                  // One color is too dominant, might be a complex image
                  imageType = 'gradient';
                }
              } else if (effectiveColorCount <= 5) {
                // 3-5 effective colors - likely gradient or complex design
                imageType = 'gradient';
              } else {
                // More than 5 effective colors - full color image
                imageType = 'full-color';
              }
            }
            
            // Convert palette to ColorInfo format
            const palette: ColorInfo[] = paletteRgb.map((rgb) => ({
              rgb,
              hex: rgbToHex(rgb),
              percentage: Math.round((1 / paletteRgb.length) * 100 * 100) / 100
            }));
            
            // Create dominant color info
            const dominantColor: ColorInfo = {
              rgb: dominantRgb,
              hex: rgbToHex(dominantRgb),
              percentage: 100
            };
            
            // Get unique colors from set
            const uniqueColors: ColorInfo[] = Array.from(uniqueColorsSet)
              .slice(0, 20) // Limit to first 20 for performance
              .map(colorStr => {
                const [r, g, b] = colorStr.split(',').map(Number) as [number, number, number];
                return {
                  rgb: [r, g, b],
                  hex: rgbToHex([r, g, b]),
                  percentage: 0
                };
              });
              const result: ColorAnalysis = {
              dominantColor,
              palette,
              totalColors: uniqueColorsSet.size,
              uniqueColors,
              isSpotColor,
              spotColorCount,
              imageType
            };
            
            setAnalysis(result);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(imageFile);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeImage,
    analysis,
    isAnalyzing,
    error,
    clearAnalysis: () => setAnalysis(null)
  };
};
