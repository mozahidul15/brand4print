import { useCallback } from 'react';

export interface SimplifiedImage {
  canvas: HTMLCanvasElement;
  blob: Blob;
  colors: string[];
}

export const useImageSimplification = () => {
  const simplifyImage = useCallback(async (
    imageFile: File, 
    maxColors: number = 2
  ): Promise<SimplifiedImage | null> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');

          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          // Detect background colors by checking the edges of the image
          const getPixelIndex = (x: number, y: number) => (y * canvas.width + x) * 4;
          const isBackground = (x: number, y: number) => {
            // Check if pixel is on the edge
            return x === 0 || x === canvas.width - 1 || y === 0 || y === canvas.height - 1;
          };

          // Collect edge colors (potential background colors)
          const edgeColors = new Set<string>();
          for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
              if (isBackground(x, y)) {
                const idx = getPixelIndex(x, y);
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                edgeColors.add(`${r},${g},${b}`);
              }
            }
          }

          // Count color frequencies
          const colorFrequency = new Map<string, number>();
          const backgroundColorFrequency = new Map<string, number>();
          
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const colorKey = `${r},${g},${b}`;
            
            const pixelIndex = i / 4;
            const x = pixelIndex % canvas.width;
            const y = Math.floor(pixelIndex / canvas.width);
            
            colorFrequency.set(colorKey, (colorFrequency.get(colorKey) || 0) + 1);
            
            // If this color appears at the edges, track it as potential background
            if (isBackground(x, y)) {
              backgroundColorFrequency.set(colorKey, (backgroundColorFrequency.get(colorKey) || 0) + 1);
            }
          }

          // Identify the dominant background color (most frequent color at edges)
          let dominantBackgroundColor = null;
          let maxBackgroundFreq = 0;
          
          for (const [color, freq] of backgroundColorFrequency.entries()) {
            if (freq > maxBackgroundFreq) {
              maxBackgroundFreq = freq;
              dominantBackgroundColor = color;
            }
          }

          // Filter out background color if it's clearly dominant at edges and represents a significant portion
          const allColorsSorted = Array.from(colorFrequency.entries())
            .sort((a, b) => b[1] - a[1]);

          let sortedColors = allColorsSorted;
            // Filter out background color if it's clearly a background (appears frequently at edges)
          // BUT ensure we keep enough colors for spot color analysis
          if (dominantBackgroundColor && backgroundColorFrequency.get(dominantBackgroundColor)! > (canvas.width + canvas.height) * 0.5) {
            const backgroundFreq = colorFrequency.get(dominantBackgroundColor) || 0;
            const totalPixels = (canvas.width * canvas.height);
              // Special handling for spot color images
            const nonBackgroundColors = allColorsSorted.filter(([color]) => color !== dominantBackgroundColor);
            
            // For spot color detection, we need to keep the background color as it's part of the design
            // This is especially important for logos on white backgrounds
            
            // Check if this might be a logo with a white or very light background
            const isWhiteBackground = dominantBackgroundColor && dominantBackgroundColor.split(',').every(val => parseInt(val) > 240);
            const isSpotColorCandidate = nonBackgroundColors.length <= maxColors + 1;
            
            if (isWhiteBackground && isSpotColorCandidate) {
              // For white background logos with few colors, always keep the white as a spot color
              sortedColors = allColorsSorted;
              console.log(`Preserving white background color: ${dominantBackgroundColor} as it's part of a potential spot color logo`);
            } else if (backgroundFreq / totalPixels > 0.6 && nonBackgroundColors.length >= maxColors) {
              // Background is very dominant (>60%) and we have enough other colors, so exclude it
              sortedColors = nonBackgroundColors;
              console.log(`Excluding dominant background color: ${dominantBackgroundColor} (${(backgroundFreq / totalPixels * 100).toFixed(1)}% of image)`);
            } else {
              // Keep background color for spot color analysis in all other cases
              sortedColors = allColorsSorted;
              console.log(`Keeping background color: ${dominantBackgroundColor} for spot color analysis`);
            }
          } else {
            sortedColors = allColorsSorted;
          }// Group similar colors to handle gradients better
          const colorSimilarityThreshold = 40; // Adjust this value to group more/fewer similar colors
          const groupedColors = new Map<string, { totalFreq: number, representative: string, colors: string[] }>();
          
          for (const [color, freq] of sortedColors) {
            const [r, g, b] = color.split(',').map(Number);
            let foundGroup = false;
              // Check if this color belongs to an existing group
            for (const [, group] of groupedColors.entries()) {
              const [gr, gg, gb] = group.representative.split(',').map(Number);
              const distance = Math.sqrt(
                Math.pow(r - gr, 2) + Math.pow(g - gg, 2) + Math.pow(b - gb, 2)
              );
              
              if (distance <= colorSimilarityThreshold) {
                group.totalFreq += freq;
                group.colors.push(color);
                foundGroup = true;
                break;
              }
            }
            
            // If no group found, create a new group
            if (!foundGroup) {
              groupedColors.set(color, {
                totalFreq: freq,
                representative: color,
                colors: [color]
              });
            }
          }
            // Sort groups by total frequency and take top groups
          const topGroups = Array.from(groupedColors.entries())
            .sort((a, b) => b[1].totalFreq - a[1].totalFreq)
            .slice(0, maxColors);
            
          // Ensure we have at least the requested number of colors
          // If we don't have enough groups, add individual colors
          const finalColors: [string, number][] = [];
          
          if (topGroups.length >= maxColors) {
            // We have enough groups, use group representatives
            finalColors.push(...topGroups.map(([, group]) => [group.representative, group.totalFreq] as [string, number]));
          } else {
            // Not enough groups, fall back to individual colors
            console.log(`Only ${topGroups.length} color groups found, falling back to individual colors`);
            finalColors.push(...sortedColors.slice(0, maxColors));
          }
          
          console.log('Color grouping applied:', {
            originalColors: sortedColors.length,
            groupedColors: groupedColors.size,
            finalGroups: topGroups.length,
            selectedColors: finalColors.map(([color]) => color)
          });

          // Extract dominant colors
          const dominantColors = finalColors.map(([colorStr]) => {
            const [r, g, b] = colorStr.split(',').map(Number);
            return { r, g, b };
          });          console.log('Image simplification process:', {
            totalColors: colorFrequency.size,
            selectedColors: dominantColors.map(c => `rgb(${c.r},${c.g},${c.b})`),
            maxColors
          });          // Simple color mapping - map each pixel to nearest dominant color
          const simplifiedImageData = ctx.createImageData(canvas.width, canvas.height);
          
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Find the nearest dominant color
            let nearestColor = dominantColors[0];
            let minDistance = Infinity;
            
            for (const color of dominantColors) {
              const distance = Math.sqrt(
                Math.pow(r - color.r, 2) +
                Math.pow(g - color.g, 2) +
                Math.pow(b - color.b, 2)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                nearestColor = color;
              }
            }
            
            simplifiedImageData.data[i] = nearestColor.r;
            simplifiedImageData.data[i + 1] = nearestColor.g;
            simplifiedImageData.data[i + 2] = nearestColor.b;
            simplifiedImageData.data[i + 3] = a;
          }
          
          ctx.putImageData(simplifiedImageData, 0, 0);

          // Convert to blob with maximum compression to reduce color variations
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            const colors = dominantColors.map(color => 
              `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
            );

            resolve({
              canvas,
              blob,
              colors
            });
          }, 'image/png', 0.9); // Use PNG with high quality to minimize compression artifacts

        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

  return { simplifyImage };
};
