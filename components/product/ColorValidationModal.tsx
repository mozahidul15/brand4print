import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColorAnalysisResults } from '@/components/ColorAnalysisResults';
import { ColorAnalysis } from '@/hooks/useColorExtraction';
import { Button } from '@/components/ui/button';

interface ColorValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ColorAnalysis | null;
  isAnalyzing: boolean;
  onSimplifyImage: () => void;
}

export const ColorValidationModal: React.FC<ColorValidationModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isAnalyzing,
  onSimplifyImage
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Image Color Analysis</DialogTitle>
        </DialogHeader>
        
        {isAnalyzing ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Analyzing image colors...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            <ColorAnalysisResults analysis={analysis} />
            
            {!analysis.isSpotColor && (
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSimplifyImage}>
                  Simplify Image Colors
                </Button>
              </div>
            )}
            
            {analysis.isSpotColor && (
              <div className="flex justify-end mt-4">
                <Button onClick={onClose}>
                  Continue with Image
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>No analysis data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
