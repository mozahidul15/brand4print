/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DesignHistory {
  designHash: string;
  productType: string;
  printedAt: Date;
  orderId?: string;
}

interface OrderHistoryContextType {
  designHistory: DesignHistory[];
  hasDesignBeenPrinted: (designHash: string, productType: string) => boolean;
  addDesignToHistory: (designHash: string, productType: string, orderId?: string) => void;
  clearHistory: () => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

export const OrderHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designHistory, setDesignHistory] = useState<DesignHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brand4print-design-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDesignHistory(parsed.map((item: any) => ({
          ...item,
          printedAt: new Date(item.printedAt)
        })));
      }
    } catch (error) {
      console.error('Error loading design history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('brand4print-design-history', JSON.stringify(designHistory));
  }, [designHistory]);

  const hasDesignBeenPrinted = (designHash: string, productType: string): boolean => {
    return designHistory.some(
      item => item.designHash === designHash && item.productType === productType
    );
  };

  const addDesignToHistory = (designHash: string, productType: string, orderId?: string) => {
    setDesignHistory(prev => [
      ...prev,
      {
        designHash,
        productType,
        printedAt: new Date(),
        orderId
      }
    ]);
  };

  const clearHistory = () => {
    setDesignHistory([]);
  };

  return (
    <OrderHistoryContext.Provider
      value={{
        designHistory,
        hasDesignBeenPrinted,
        addDesignToHistory,
        clearHistory,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistory = (): OrderHistoryContextType => {
  const context = useContext(OrderHistoryContext);
  if (context === undefined) {
    throw new Error('useOrderHistory must be used within an OrderHistoryProvider');
  }
  return context;
};

// Utility function to generate a hash from file content
export const generateDesignHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
