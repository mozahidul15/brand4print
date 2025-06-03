/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ArtworkAnalysis {
  colorCount: number;
  complexity: 'simple' | 'complex';
  isVector: boolean;
  needsVectorization: boolean;
  fileType: string;
  dimensions: {
    width?: number;
    height?: number;
  };
  fileSize: number;
  analysis: {
    hasGradients: boolean;
    isHighRes: boolean;
  };
}

interface CustomizationFees {
  plateFee: number;
  vectorizationFee: number;
  setupFee: number;
  totalAdditionalFees: number;
}

interface CustomizationState {
  // Product details
  productId?: string;
  selectedSize?: string;
  selectedPrintOption?: string;
  basePrice: number;
  
  // Artwork details
  uploadedFile?: File;
  designUrl?: string;
  artworkAnalysis?: ArtworkAnalysis;
  
  // Fees and pricing
  fees: CustomizationFees;
  isFirstTimePrinting: boolean;
    // UI state
  step: 'upload' | 'validation' | 'firstTime' | 'preview' | 'checkout';
  isLoading: boolean;
  error?: string;
}

interface CustomizationContextType {
  state: CustomizationState;
  updateState: (updates: Partial<CustomizationState>) => void;
  analyzeArtwork: (file: File) => Promise<void>;
  calculateFees: () => void;
  resetCustomization: () => void;
  proceedToNextStep: () => void;
}

const defaultState: CustomizationState = {
  basePrice: 0,
  fees: {
    plateFee: 0,
    vectorizationFee: 0,
    setupFee: 0,
    totalAdditionalFees: 0
  },
  isFirstTimePrinting: false,
  step: 'upload',
  isLoading: false
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CustomizationState>(defaultState);

  const updateState = useCallback((updates: Partial<CustomizationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const analyzeArtwork = useCallback(async (file: File) => {
    updateState({ isLoading: true, error: undefined });
    
    try {
      const formData = new FormData();
      formData.append('artwork', file);
      
      const response = await fetch('/api/artwork/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyze artwork');
      }

      const analysis: ArtworkAnalysis = await response.json();
      
      updateState({
        uploadedFile: file,
        artworkAnalysis: analysis,
        isLoading: false
      });

      // Auto-calculate fees after analysis
      calculateFeesWithAnalysis(analysis);
      
    } catch (error: any) {
      console.error('Error analyzing artwork:', error);
      updateState({
        isLoading: false,
        error: error.message || 'Failed to analyze artwork'
      });
    }
  }, []);

  const calculateFeesWithAnalysis = (analysis: ArtworkAnalysis) => {
    const fees: CustomizationFees = {
      plateFee: 0,
      vectorizationFee: 0,
      setupFee: 0,
      totalAdditionalFees: 0
    };

    // Add plate fee for first-time printing
    if (state.isFirstTimePrinting) {
      fees.plateFee = 100;
    }

    // Add vectorization fee based on complexity and file type
    if (analysis.needsVectorization) {
      if (analysis.complexity === 'complex' || analysis.analysis.hasGradients) {
        fees.vectorizationFee = 50; // Complex artwork
      } else {
        fees.vectorizationFee = 30; // Simple artwork
      }
    }

    // Add setup fee for high-res images
    if (analysis.analysis.isHighRes) {
      fees.setupFee = 25;
    }

    fees.totalAdditionalFees = fees.plateFee + fees.vectorizationFee + fees.setupFee;

    updateState({ fees });
  };

  const calculateFees = useCallback(() => {
    if (state.artworkAnalysis) {
      calculateFeesWithAnalysis(state.artworkAnalysis);
    }
  }, [state.artworkAnalysis, state.isFirstTimePrinting]);

  const resetCustomization = useCallback(() => {
    setState(defaultState);
  }, []);
  const proceedToNextStep = useCallback(() => {
    const { step, artworkAnalysis } = state;
    
    switch (step) {
      case 'upload':
        if (artworkAnalysis) {
          if (artworkAnalysis.complexity === 'complex') {
            updateState({ step: 'validation' });
          } else {
            updateState({ step: 'firstTime' });
          }
        }
        break;
      case 'validation':
        updateState({ step: 'firstTime' });
        break;
      case 'firstTime':
        updateState({ step: 'preview' });
        break;
      case 'preview':
        updateState({ step: 'checkout' });
        break;
      default:
        break;
    }
  }, [state, updateState]);

  const value: CustomizationContextType = {
    state,
    updateState,
    analyzeArtwork,
    calculateFees,
    resetCustomization,
    proceedToNextStep
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = (): CustomizationContextType => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
