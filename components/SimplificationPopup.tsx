import React, { useState } from 'react';
import { X, AlertTriangle, FileImage, Palette, Wand2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useImageSimplification } from '@/hooks/useImageSimplification';

interface SimplificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  totalColors: number;
  imageType: 'gradient' | 'full-color';
  originalImage?: File;
  onSimplifiedImage?: (file: File) => void;
}

export const SimplificationPopup: React.FC<SimplificationPopupProps> = ({
  isOpen,
  onClose,
  totalColors,
  imageType,
  originalImage,
  onSimplifiedImage
}) => {
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedImageUrl, setSimplifiedImageUrl] = useState<string | null>(null);
  const [simplifiedColors, setSimplifiedColors] = useState<string[]>([]);
  const { simplifyImage } = useImageSimplification();

  const handleSimplify = async () => {
    if (!originalImage) return;
    
    setIsSimplifying(true);
    try {
      const result = await simplifyImage(originalImage, 2);
      if (result) {
        const url = URL.createObjectURL(result.blob);
        setSimplifiedImageUrl(url);
        setSimplifiedColors(result.colors);
      }
    } catch (error) {
      console.error('Failed to simplify image:', error);
    } finally {
      setIsSimplifying(false);
    }
  };  const handleUseSimplified = () => {
    if (simplifiedImageUrl && onSimplifiedImage) {
      // Convert blob URL back to File and mark as simplified
      fetch(simplifiedImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'simplified-image.png', { type: 'image/png' });
          // Add a custom property to indicate this is a simplified image
          Object.defineProperty(file, 'isSimplified', { value: true, writable: false });
          onSimplifiedImage(file);
          onClose();
        });
    }
  };

  const handleDownload = () => {
    if (simplifiedImageUrl) {
      const link = document.createElement('a');
      link.href = simplifiedImageUrl;
      link.download = 'simplified-spot-color-image.png';
      link.click();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Image Not Suitable for Spot Color
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <p className="font-medium text-red-700">
                {imageType === 'full-color' ? 'Full-Color Image Detected' : 'Gradient Image Detected'}
              </p>
            </div>
            <p className="text-red-600 text-sm">
              This image contains <strong>{totalColors} unique colors</strong>, but spot color printing 
              requires exactly <strong>1 or 2 solid colors</strong> only.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              To make your image spot color compatible:
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Use only 1-2 solid colors in your design</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Avoid gradients, shadows, and anti-aliasing effects</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Save as PNG with no compression or effects</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Use vector graphics software for best results</span>
              </div>
            </div>
          </div>          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <FileImage className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Pro Tip:</p>
                <p className="text-blue-700">
                  Create your design using solid colors only in software like Adobe Illustrator, 
                  Figma, or Canva, then export as a high-quality PNG.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-Simplification Option */}
          {originalImage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-4 h-4 text-green-600" />
                <p className="font-medium text-green-800">Auto-Simplify Image</p>
              </div>
              <p className="text-green-700 text-sm mb-3">
                Let us automatically reduce your image to its 2 most dominant colors for spot color printing.
              </p>
              
              {!simplifiedImageUrl ? (
                <Button 
                  onClick={handleSimplify}
                  disabled={isSimplifying}
                  className="w-full"
                  variant="outline"
                >
                  {isSimplifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Simplifying...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Simplify to 2 Colors
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={simplifiedImageUrl} 
                      alt="Simplified" 
                      className="w-20 h-20 object-contain border rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Simplified to {simplifiedColors.length} colors!</p>
                      <div className="flex gap-1 mt-1">
                        {simplifiedColors.map((color, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleUseSimplified}
                      className="flex-1"
                      size="sm"
                    >
                      Use This Image
                    </Button>
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={onClose}
              className="flex-1"
              variant="outline"
            >
              I&apos;ll Simplify My Image
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1"
              variant="default"
            >
              Upload Different Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
