/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  Trash2,
  Download,
  Copy,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  // Settings,
  Star,
  Triangle,
  Minus,
  Lock,
  Eye,
  EyeOff,
  // MousePointer,
  Layers,
  Move,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  Palette
} from 'lucide-react';
import { useCart } from '../cart';
import { useToast } from '../ui/toast';
import crypto from 'crypto';
import { useColorExtraction } from '@/hooks/useColorExtraction';
import { useImageSimplification } from '@/hooks/useImageSimplification';
import { ColorValidationModal } from './ColorValidationModal';

interface DesignData {
  canvasData: object;
  previewImage: string;
  complexity: 'simple' | 'complex';
  colorCount: number;
  needsVectorization: boolean;
  estimatedFees: {
    vectorization: number;
    complexity: number;
  };
}

interface product {
  id: string;
  title: string;
  productType: string;
  mockupImages?: {
    front: string;
  },
  minPrice: number;
  maxPrice: number;
  quantity: number;
  bagSize?: string;
  printColor?: string;
}

interface FabricEditorProps {
  product: product;
  uploadedFile?: File;
  onDesignReady: (designData: DesignData) => void;
  onClose: () => void;
}

interface HistoryState {
  state: string;
  timestamp: number;
}

// Enhanced Fabric.js Editor Component with Rich Features
const FabricEditor: React.FC<FabricEditorProps> = ({ product, uploadedFile, onDesignReady, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitializingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canvas, setCanvas] = useState<any>(null);
  const [fabricClasses, setFabricClasses] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [activeObject, setActiveObject] = useState<any>(null);
  const [canvasMode, setCanvasMode] = useState<'select' | 'drawing' | 'text'>('select');
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);  const [layers, setLayers] = useState<any[]>([]);
  // State to track background visibility
  const [showBackground, setShowBackground] = useState(true);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  // New state for validation and preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    colorCount: number;
  } | null>(null);
  const [showAddToCart, setShowAddToCart] = useState(false);

  // State for first-time printing workflow
  const [showFirstTimePrintingDialog, setShowFirstTimePrintingDialog] = useState(false);
  const [isFirstTimePrinting, setIsFirstTimePrinting] = useState(true);
  const [isCheckingDesignHistory, setIsCheckingDesignHistory] = useState(false);
  const [currentDesignHash, setCurrentDesignHash] = useState<string | null>(null);

  // Color validation state
  const [showColorValidationModal, setShowColorValidationModal] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const { analyzeImage, analysis, isAnalyzing, clearAnalysis } = useColorExtraction();
  const { simplifyImage } = useImageSimplification();

  // Utility function to generate design hash from canvas data
  const generateDesignHash = useCallback((canvasData: object): string => {
    const designString = JSON.stringify(canvasData);
    return crypto.createHash('sha256').update(designString).digest('hex');
  }, []);

  // Function to check if design has been printed before
  const checkDesignHistory = useCallback(async (designHash: string): Promise<boolean> => {
    try {
      setIsCheckingDesignHistory(true);

      const response = await fetch('/api/design-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artworkData: { designHash } // Using the hash directly for checking
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check design history');
      }

      const data = await response.json();
      console.log('Design history check result:', data);
      return data.hasBeenPrinted;
    } catch (error) {
      console.error('Error checking design history:', error);
      return false; // Default to false if check fails
    } finally {
      setIsCheckingDesignHistory(false);
    }
  }, []);// Effect to handle canvasMode changes
  useEffect(() => {
    if (!canvas) return;

    // Remove any existing mouse:down event listeners to prevent duplicates
    canvas.off('mouse:down');

    if (canvasMode === 'drawing') {
      canvas.isDrawingMode = true;
      canvas.selection = false;

      // Disable text editing for all text objects when in drawing mode
      canvas.getObjects().forEach((obj: any) => {
        if (obj.type === 'text') {
          obj.set('editable', false);
        }
      });
    } else if (canvasMode === 'text') {
      canvas.isDrawingMode = false;
      canvas.selection = true;

      // Ensure active text object is editable
      const currentActiveObject = canvas.getActiveObject();
      if (currentActiveObject && currentActiveObject.type === 'text') {
        currentActiveObject.set('editable', true);
        currentActiveObject.enterEditing();
        canvas.setActiveObject(currentActiveObject);
      }

      // If clicking on text objects in text mode, make them editable
      const handleTextClick = (e: any) => {
        if (e.target && e.target.type === 'text' && canvasMode === 'text') {
          e.target.set('editable', true);
          canvas.setActiveObject(e.target);
        }
      };

      canvas.on('mouse:down', handleTextClick);
    } else {
      // Select mode
      canvas.isDrawingMode = false;
      canvas.selection = true;

      // Make text objects non-editable by default in select mode
      canvas.getObjects().forEach((obj: any) => {
        if (obj.type === 'text') {
          obj.set('editable', false);
        }
      });
    }

    canvas.renderAll();

    // Cleanup function to remove event listeners
    return () => {
      if (canvas) {
        canvas.off('mouse:down');
      }
    };
  }, [canvasMode, canvas]);
  // Color palette for design
  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FF69B4', '#32CD32', '#FFD700', '#FF4500', '#8A2BE2'
  ];

  // Font families
  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Trebuchet MS'
  ];  // Helper function to ensure user content stays on top of backgrounds
  const ensureUserContentOnTop = useCallback(() => {
    if (!canvas) return;

    // First, bring backgrounds to the back
    const backgroundObjects = canvas.getObjects().filter((obj: any) =>
      obj.data && obj.data.type === 'background'
    );

    console.log(`Moving ${backgroundObjects.length} background objects to back`);

    // Send all background objects to the back
    backgroundObjects.forEach((obj: any) => {
      canvas.sendObjectToBack(obj);
    });

    // Then bring user content to the front
    const userObjects = canvas.getObjects().filter((obj: any) =>
      obj.data && obj.data.type === 'userContent'
    );

    console.log(`Bringing ${userObjects.length} user objects forward`);    // Sort user objects to maintain their relative ordering
    const sortedUserObjects = [...userObjects].sort((a: any, b: any) => {
      // Use indexOf to get the current position of objects in the canvas
      const allObjects = canvas.getObjects();
      return allObjects.indexOf(a) - allObjects.indexOf(b);
    });

    // Bring each user object forward to ensure proper stacking
    sortedUserObjects.forEach((obj: any, index: number) => {
      // Calculate target index - we want user objects at the top of the stack
      const allObjects = canvas.getObjects();
      const targetIndex = allObjects.length - sortedUserObjects.length + index;      // Move object to its target position
      canvas.moveObjectTo(obj, targetIndex);
    });

    canvas.renderAll();
    console.log('Layer ordering completed');
  }, [canvas]);

  // Save canvas state to history
  const saveToHistory = useCallback(() => {
    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({
        state,
        timestamp: Date.now()
      });

      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [canvas, historyIndex]);
  // Helper function to try loading an image from the public folder
  const tryLoadingFromPublicFolder = useCallback((imageUrl: string, isBackground: boolean = true) => {
    if (!canvas || !fabricClasses?.Image) return false;

    try {
      // Extract the filename from the URL
      const urlParts = imageUrl.split('/');
      let filename = urlParts[urlParts.length - 1];

      // Clean the filename - remove query parameters if any
      if (filename.includes('?')) {
        filename = filename.split('?')[0];
      }

      // Check for different image extensions
      const baseFilename = filename.includes('.')
        ? filename.substring(0, filename.lastIndexOf('.'))
        : filename;

      // Try different extensions
      const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

      // Generate paths to try - FIXED: Remove /public/ prefix for Next.js
      let possiblePaths: string[] = [];

      // Add paths with original filename first (correct Next.js public path)
      possiblePaths = [
        `/mockups/${filename}`,
      ];

      // Then add paths with different extensions
      extensions.forEach(ext => {
        possiblePaths.push(
          `/mockups/${baseFilename}${ext}`,
        );
      });

      // Also try some common fallback images that exist in the mockups folder
      possiblePaths.push(
        '/mockups/front.jpg',
        '/mockups/back.png',
        '/mockups/white-paper-bags.jpg'
      );

      console.log('Trying to load image from public folder. Filename:', filename);
      console.log('Possible paths:', possiblePaths); const publicImg = new Image();
      publicImg.crossOrigin = 'anonymous';
      publicImg.src = possiblePaths[0]; // Try the first path

      let pathIndex = 0;

      const tryNextPath = () => {
        pathIndex++;
        if (pathIndex < possiblePaths.length) {
          console.log('Trying next possible path:', possiblePaths[pathIndex]);
          publicImg.src = possiblePaths[pathIndex];
        } else {
          console.error('Failed to load image from all possible public paths');
          return false;
        }
      };

      publicImg.onload = () => {
        console.log('Successfully loaded image from public folder:', publicImg.src);
        const fabricImage = new fabricClasses.Image(publicImg);

        // Calculate proper scaling to fit the canvas
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        const scale = Math.min(
          canvasWidth / publicImg.width,
          canvasHeight / publicImg.height
        );

        fabricImage.set({
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale, selectable: !isBackground,
          evented: !isBackground,
          lockMovementX: isBackground,
          lockMovementY: isBackground,
          visible: isBackground ? showBackground : true,
          data: { type: isBackground ? 'background' : 'image' }
        });

        canvas.add(fabricImage);

        if (isBackground) {
          canvas.sendObjectToBack(fabricImage);
        }

        canvas.renderAll();
        saveToHistory();
        return true;
      };

      publicImg.onerror = () => {
        tryNextPath();
      };

      return true;
    } catch (error) {
      console.error('Error trying to load from public folder:', error);
      return false;
    }
  }, [canvas, fabricClasses, saveToHistory, showBackground]);

  // Function to load mockup image to canvas
  const loadMockupImage = useCallback((imageUrl: string, isBackground: boolean = true) => {
    if (!canvas || !fabricClasses?.Image) return;

    console.log('Loading mockup image:', imageUrl);

    // Validate image URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error('Invalid image URL:', imageUrl);
      return;
    }

    // First, remove any existing background images if this is a background
    if (isBackground) {
      const objectsToRemove = canvas.getObjects().filter((obj: any) =>
        obj.data && obj.data.type === 'background'
      );

      console.log(`Removing ${objectsToRemove.length} existing background objects`);
      objectsToRemove.forEach((obj: any) => {
        canvas.remove(obj);
      });
    }

    // Create a new image element
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    // Add a timeout to check if image loading is taking too long
    const timeout = setTimeout(() => {
      console.warn('Image loading timeout for:', imageUrl);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      console.log('Image loaded successfully:', imageUrl, img.width, 'x', img.height);
      try {
        // Create a fabric image from the loaded img
        const fabricImage = new fabricClasses.Image(img);

        // Calculate proper scaling to fit the canvas
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        const scale = Math.min(
          canvasWidth / img.width,
          canvasHeight / img.height
        );

        console.log('Scale:', scale, 'Canvas size:', canvasWidth, 'x', canvasHeight);

        // Set image properties
        fabricImage.set({
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
          selectable: !isBackground,
          evented: !isBackground,
          lockMovementX: isBackground,
          lockMovementY: isBackground,
          visible: isBackground ? showBackground : true,
          // Store metadata to identify this as a background
          data: { type: isBackground ? 'background' : 'image' }
        });        // Add the image to canvas
        canvas.add(fabricImage);

        // If it's a background, send it to the back
        if (isBackground) {
          canvas.sendObjectToBack(fabricImage);
        }

        canvas.renderAll();
        console.log('Image added to canvas');

        // Save state to history
        saveToHistory();
      } catch (error) {
        console.error('Error creating fabric image:', error);
      }
    }; img.onerror = (err) => {
      clearTimeout(timeout);
      console.error('Error loading image:', imageUrl, err);

      // First try loading from public folder
      console.log('Trying to load from public folder...');
      const loadedFromPublic = tryLoadingFromPublicFolder(imageUrl, isBackground);

      // Add a small delay before trying proxy methods
      setTimeout(() => {
        if (!loadedFromPublic && !imageUrl.includes('data:')) {
          console.log('Loading from public folder failed, attempting proxy API...');

          // Try with our internal proxy API
          try {
            const fallbackImg = new Image();
            fallbackImg.crossOrigin = 'anonymous';
            fallbackImg.src = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;

            fallbackImg.onload = () => {
              console.log('Fallback image load successful with proxy API');
              const fabricImage = new fabricClasses.Image(fallbackImg);

              // Calculate proper scaling to fit the canvas
              const canvasWidth = canvas.getWidth();
              const canvasHeight = canvas.getHeight();

              const scale = Math.min(
                canvasWidth / fallbackImg.width,
                canvasHeight / fallbackImg.height
              );

              fabricImage.set({
                left: 0,
                top: 0,
                scaleX: scale,
                scaleY: scale,
                selectable: !isBackground,
                evented: !isBackground,
                lockMovementX: isBackground,
                lockMovementY: isBackground,
                visible: isBackground ? showBackground : true,
                data: { type: isBackground ? 'background' : 'image' }
              }); canvas.add(fabricImage);

              if (isBackground) {
                canvas.sendObjectToBack(fabricImage);
              }

              canvas.renderAll();
              saveToHistory();
            };

            fallbackImg.onerror = () => {
              console.error('Proxy API failed, trying external CORS proxy...');

              // If our proxy fails, try with external CORS proxy as backup
              const secondFallbackImg = new Image();
              secondFallbackImg.crossOrigin = 'anonymous';
              secondFallbackImg.src = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;

              secondFallbackImg.onload = () => {
                console.log('External CORS proxy load successful');
                const fabricImage = new fabricClasses.Image(secondFallbackImg);

                // Calculate proper scaling to fit the canvas
                const canvasWidth = canvas.getWidth();
                const canvasHeight = canvas.getHeight();

                const scale = Math.min(
                  canvasWidth / secondFallbackImg.width,
                  canvasHeight / secondFallbackImg.height
                );

                fabricImage.set({
                  left: 0,
                  top: 0,
                  scaleX: scale,
                  scaleY: scale,
                  selectable: !isBackground,
                  evented: !isBackground,
                  lockMovementX: isBackground,
                  lockMovementY: isBackground,
                  visible: isBackground ? showBackground : true,
                  data: { type: isBackground ? 'background' : 'image' }
                }); canvas.add(fabricImage);

                if (isBackground) {
                  canvas.sendObjectToBack(fabricImage);
                }

                canvas.renderAll();
                saveToHistory();
              };

              secondFallbackImg.onerror = () => {
                console.error('All fallback methods failed. Unable to load image:', imageUrl);

                // Try to load a default placeholder image from public folder
                try {
                  const placeholderImg = new Image();
                  placeholderImg.crossOrigin = 'anonymous';
                  // Try the placeholder image in public folder (now using SVG which is more reliable)
                  placeholderImg.src = '/placeholder-image.svg';

                  placeholderImg.onerror = () => {
                    console.error('Could not load placeholder image, using data URI');
                    // If local placeholder fails, use a data URI as absolute last resort
                    const svgPlaceholder = `
                      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
                        <rect width="100%" height="100%" fill="#f0f0f0"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#888888">Image not available</text>
                      </svg>
                    `;
                    const dataURI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPlaceholder.trim())}`;
                    placeholderImg.src = dataURI;
                  };

                  placeholderImg.onload = () => {
                    console.log('Loaded placeholder image');
                    const fabricImage = new fabricClasses.Image(placeholderImg);

                    const canvasWidth = canvas.getWidth();
                    const canvasHeight = canvas.getHeight();

                    const scale = Math.min(
                      canvasWidth / placeholderImg.width,
                      canvasHeight / placeholderImg.height
                    );

                    fabricImage.set({
                      left: 0,
                      top: 0,
                      scaleX: scale,
                      scaleY: scale,
                      selectable: !isBackground,
                      evented: !isBackground,
                      lockMovementX: isBackground,
                      lockMovementY: isBackground,
                      visible: isBackground ? showBackground : true,
                      data: { type: isBackground ? 'background' : 'image' }
                    });

                    canvas.add(fabricImage); if (isBackground) {
                      canvas.sendObjectToBack(fabricImage);
                    }

                    canvas.renderAll();
                    saveToHistory();
                  };

                  placeholderImg.onerror = () => {
                    // Show a placeholder or error message on the canvas
                    const errorText = new fabricClasses.Text('Image Failed to Load', {
                      left: canvas.getWidth() / 2,
                      top: canvas.getHeight() / 2,
                      originX: 'center',
                      originY: 'center',
                      fontSize: 16,
                      fill: 'red'
                    });

                    canvas.add(errorText);
                    canvas.renderAll();
                  };
                } catch (error) {
                  console.error('Error loading placeholder:', error);

                  // Show a placeholder or error message on the canvas
                  const errorText = new fabricClasses.Text('Image Failed to Load', {
                    left: canvas.getWidth() / 2,
                    top: canvas.getHeight() / 2,
                    originX: 'center',
                    originY: 'center',
                    fontSize: 16,
                    fill: 'red'
                  });

                  canvas.add(errorText);
                  canvas.renderAll();
                }
              };
            };
          } catch (error) {
            console.error('Error in fallback loading:', error);

            // Show a placeholder or error message on the canvas
            const errorText = new fabricClasses.Text('Image Failed to Load', {
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              originX: 'center',
              originY: 'center',
              fontSize: 16,
              fill: 'red'
            });

            canvas.add(errorText);
            canvas.renderAll();
          }
        }
      }, 100); // Add delay for tryLoadingFromPublicFolder
    };
  }, [canvas, fabricClasses, saveToHistory, showBackground, tryLoadingFromPublicFolder]);  // Add a ref to track if mockup is already loaded for current view
  const mockupLoadedRef = useRef<string | null>(null);
  useEffect(() => {
    if (canvas && fabricClasses && product?.mockupImages) {
      // Create a unique key for this product
      const currentKey = `${product.id || 'unknown'}`;

      // Only load if this is a different product
      if (mockupLoadedRef.current !== currentKey) {
        console.log('Loading mockup image on canvas ready');
        console.log('Available mockup images:', product.mockupImages);

        // Update the ref to track what we're loading
        mockupLoadedRef.current = currentKey;

        // Get the mockup image
        const mockupImage = product.mockupImages.front;

        if (mockupImage) {
          console.log(`Loading mockup image:`, mockupImage);
          loadMockupImage(mockupImage, true);

          // Use a single delayed call to ensure ordering is correct
          const timeoutId = setTimeout(() => {
            ensureUserContentOnTop();
            console.log('Layer ordering enforced after background load');
          }, 500);

          // Cleanup timeout on unmount or dependency change
          return () => clearTimeout(timeoutId);
        } else {
          console.warn(`No mockup image available`);
        }
      }
    }
  }, [canvas, fabricClasses, product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize Fabric.js Canvas
  useEffect(() => {
    let fabricCanvas: any = null; const initializeFabricCanvas = async () => {
      try {
        isInitializingRef.current = true;

        if (!canvasRef.current) {
          setIsLoading(false);
          isInitializingRef.current = false;
          return;
        }        // Check if canvas element already has a fabric canvas
        if ((canvasRef.current as any).__fabric) {
          console.warn('Canvas already has fabric instance, skipping initialization');
          setIsLoading(false);
          isInitializingRef.current = false;
          return;
        }// Import fabric.js version 6
        const fabricModule = await import('fabric').then(m => m?.default || m);

        if (!fabricModule?.Canvas) {
          console.error('Fabric.js failed to load');
          setIsLoading(false);
          return;
        }

        // In Fabric.js v6, we need to access the Canvas, Image, Text, etc. from the module
        const fabricClasses = {
          Canvas: fabricModule.Canvas,
          Image: fabricModule.Image,
          Text: fabricModule.Text,
          Rect: fabricModule.Rect,
          Circle: fabricModule.Circle,
          Triangle: fabricModule.Triangle,
          Line: fabricModule.Line,
          Path: fabricModule.Path
        };
        setFabricClasses(fabricClasses);

        // Create a new canvas
        fabricCanvas = new fabricClasses.Canvas(canvasRef.current, {
          width: 500,
          height: 500,
          backgroundColor: '#ffffff',
          selection: canvasMode === 'select', // Initial selection mode
          // controlsAboveOverlay: true, // Consider if needed
          preserveObjectStacking: true // Important for layers
        });        // Set up canvas events with proper debouncing
        let selectionTimeout: NodeJS.Timeout | null = null;

        fabricCanvas.on('selection:created', (e: any) => {
          setActiveObject(e.selected[0]);
          // Debounce layer updates to prevent infinite loops
          if (selectionTimeout) clearTimeout(selectionTimeout);
          selectionTimeout = setTimeout(() => {
            if (!isInitializingRef.current) {
              setLayers([...fabricCanvas.getObjects()]);
            }
          }, 100);
        });

        fabricCanvas.on('selection:updated', (e: any) => {
          setActiveObject(e.selected[0]);
          if (selectionTimeout) clearTimeout(selectionTimeout);
          selectionTimeout = setTimeout(() => {
            if (!isInitializingRef.current) {
              setLayers([...fabricCanvas.getObjects()]);
            }
          }, 100);
        });

        fabricCanvas.on('selection:cleared', () => {
          setActiveObject(null);
        });

        // Initial mode setup
        if (canvasMode === 'drawing') {
          fabricCanvas.isDrawingMode = true;
          fabricCanvas.selection = false;
        } else if (canvasMode === 'text') {
          fabricCanvas.isDrawingMode = false;
          fabricCanvas.selection = true;
        } else {
          fabricCanvas.isDrawingMode = false;
          fabricCanvas.selection = true;
        }        // Debounced layer updates to prevent infinite re-renders
        let updateTimeout: NodeJS.Timeout | null = null;
        const debouncedUpdateLayers = () => {
          if (updateTimeout) clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => {
            if (fabricCanvas && !isInitializingRef.current) {
              setLayers([...fabricCanvas.getObjects()]);
            }
          }, 150);
        };

        fabricCanvas.on('object:modified', debouncedUpdateLayers);
        fabricCanvas.on('object:added', debouncedUpdateLayers);
        fabricCanvas.on('object:removed', debouncedUpdateLayers);

        // Clean up previous canvas state before setting new one
        if (canvas) {
          try {
            canvas.off();
            canvas.clear();
          } catch (e) {
            console.warn('Error cleaning up previous canvas:', e);
          }
        }

        setCanvas(fabricCanvas);

        // If an uploaded file was provided, add it to the canvas
        if (uploadedFile) {
          const imageUrl = URL.createObjectURL(uploadedFile);

          // Convert the image URL to a format that Fabric.js can use
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imageUrl; img.onload = () => {
            const fabricImage = new fabricClasses.Image(img);
            fabricImage.scaleToWidth(200);
            fabricImage.set({
              left: 150,
              top: 150,
              selectable: true
            });
            fabricCanvas.add(fabricImage);
            fabricCanvas.centerObject(fabricImage);
            fabricCanvas.renderAll();

            // Save to history
            setTimeout(() => {
              if (fabricCanvas && fabricCanvas.toJSON) {
                const state = JSON.stringify(fabricCanvas.toJSON());
                setHistory([{ state, timestamp: Date.now() }]);
                setHistoryIndex(0);
              }
            }, 100);
          };
        }        // Initial history save
        setTimeout(() => {
          if (fabricCanvas && fabricCanvas.toJSON) {
            const state = JSON.stringify(fabricCanvas.toJSON());
            setHistory([{ state, timestamp: Date.now() }]);
            setHistoryIndex(0);
          }

          // After canvas is initialized and history is saved, set isLoading to false
          setIsLoading(false);
          // Allow layer updates now that initialization is complete
          isInitializingRef.current = false;
        }, 100);
      } catch (error) {
        console.error('Error initializing fabric.js:', error);
        setIsLoading(false);
        isInitializingRef.current = false;
      }
    }; initializeFabricCanvas(); return () => {
      if (fabricCanvas) {
        // Proper cleanup to prevent re-initialization errors
        try {
          // Remove all event listeners first
          fabricCanvas.off();
          // Clear all objects
          fabricCanvas.clear();
          // Dispose of the canvas properly
          fabricCanvas.dispose();
          fabricCanvas = null;
        } catch (error) {
          console.error('Error cleaning up canvas:', error);
        }
      }
      // Reset initialization flag on cleanup
      isInitializingRef.current = false;
    };
  }, [uploadedFile, canvasMode]); // eslint-disable-line react-hooks/exhaustive-deps
  // Text operations
  const addText = useCallback(() => {
    if (!canvas || !fabricClasses || !fabricClasses.Text) return;

    console.log('Adding text to canvas');

    const text = new fabricClasses.Text('Edit this text', {
      left: 100,
      top: 100,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: selectedColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: true,
      editable: true,
      // Ensure text is on top of any background
      data: { type: 'userContent' }
    }); canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringObjectForward(text); // Use bringObjectForward for v6 compatibility
    canvas.renderAll();
    saveToHistory();
  }, [canvas, fabricClasses, fontFamily, fontSize, selectedColor, strokeColor, strokeWidth, saveToHistory]);
  // Shape operations
  const addRectangle = useCallback(() => {
    if (!canvas?.getContext() || !fabricClasses || !fabricClasses.Rect) return;

    console.log('Adding rectangle to canvas');

    const rect = new fabricClasses.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: selectedColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: true,
      data: { type: 'userContent' }
    }); canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.bringObjectForward(rect); // Ensure shape is visible on top of background
    canvas.renderAll();
    saveToHistory();
  }, [canvas, fabricClasses, selectedColor, strokeColor, strokeWidth, saveToHistory]);

  const addCircle = useCallback(() => {
    if (!canvas || !fabricClasses || !fabricClasses.Circle) return;

    console.log('Adding circle to canvas');

    const circle = new fabricClasses.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: selectedColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: true,
      data: { type: 'userContent' }
    }); canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.bringObjectForward(circle); // Ensure shape is visible on top of background
    canvas.renderAll();
    saveToHistory();
  }, [canvas, fabricClasses, selectedColor, strokeColor, strokeWidth, saveToHistory]);

  const addTriangle = useCallback(() => {
    if (!canvas || !fabricClasses || !fabricClasses.Triangle) return;

    console.log('Adding triangle to canvas');

    const triangle = new fabricClasses.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: selectedColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: true,
      data: { type: 'userContent' }
    }); canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.bringObjectForward(triangle); // Ensure shape is visible on top of background
    canvas.renderAll();
    saveToHistory();
  }, [canvas, fabricClasses, selectedColor, strokeColor, strokeWidth, saveToHistory]); const addLine = useCallback(() => {
    if (!canvas || !fabricClasses || !fabricClasses.Line) return;

    console.log('Adding line to canvas');

    const line = new fabricClasses.Line([50, 100, 150, 100], {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: true,
      data: { type: 'userContent' }
    }); canvas.add(line);
    canvas.setActiveObject(line);
    canvas.bringObjectForward(line); // Use bringObjectForward for v6 compatibility
    canvas.renderAll();
    saveToHistory();
  }, [canvas, fabricClasses, strokeColor, strokeWidth, saveToHistory]);

  const addStar = useCallback(() => {
    if (!canvas || !fabricClasses || !fabricClasses.Path) return;

    console.log('Adding star to canvas');

    // Create a star path
    const starPath = 'M 50 0 L 60 35 L 100 35 L 70 57 L 80 92 L 50 70 L 20 92 L 30 57 L 0 35 L 40 35 Z';

    const star = new fabricClasses.Path(starPath, {
      left: 100,
      top: 100,
      fill: selectedColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      scaleX: 0.5,
      scaleY: 0.5,
      selectable: true,
      data: { type: 'userContent' }
    }); canvas.add(star);
    canvas.setActiveObject(star);
    canvas.bringObjectForward(star); // Use bringObjectForward for v6 compatibility
    canvas.renderAll();
    saveToHistory();
  }, [canvas, fabricClasses, selectedColor, strokeColor, strokeWidth, saveToHistory]);  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas && fabricClasses && fabricClasses.Image) {
      // Set current image file for validation
      setCurrentImageFile(file);
      
      // First, validate the image colors
      analyzeImage(file).then((colorAnalysis) => {
        if (colorAnalysis) {
          // Show the color validation modal
          setShowColorValidationModal(true);
          
          // If the image is already a spot color image, we can proceed with adding it
          if (colorAnalysis.isSpotColor) {
            addImageToCanvas(file);
          }
          // If not a spot color image, the user will need to click "Simplify" in the modal
        }
      });
    }
  }, [canvas, fabricClasses, analyzeImage]);
  
  // Helper function to add image to canvas
  const addImageToCanvas = useCallback((file: File) => {
    if (!canvas || !fabricClasses || !fabricClasses.Image) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const fabricImage = new fabricClasses.Image(img);
        fabricImage.scaleToWidth(200);
        fabricImage.set({
          left: 100,
          top: 100,
          selectable: true,
          data: { type: 'userContent' } // Mark as user content, not background
        });
        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.bringObjectForward(fabricImage); // Ensure uploaded image is on top
        canvas.renderAll();
        saveToHistory();
      };
    };
    reader.readAsDataURL(file);
  }, [canvas, fabricClasses, saveToHistory]);
  // Handle simplifying the image
  const handleSimplifyImage = useCallback(async () => {
    if (!currentImageFile) return;
    
    try {
      const simplifiedResult = await simplifyImage(currentImageFile, 2); // Limit to 2 colors
      
      if (simplifiedResult) {
        // Create a new File object from the blob
        const simplifiedFile = new File(
          [simplifiedResult.blob], 
          `simplified-${currentImageFile.name}`,
          { type: 'image/png' }
        );
        
        // Add the simplified image to canvas
        addImageToCanvas(simplifiedFile);
        
        // Close the modal
        setShowColorValidationModal(false);
        
        // Clear analysis
        clearAnalysis();
      }    } catch (error) {
      console.error('Error simplifying image:', error);
      addToast({
        message: 'Failed to simplify image. Please try another image.',
        type: 'error',
        duration: 3000
      });
    }
  }, [currentImageFile, simplifyImage, addImageToCanvas, clearAnalysis, addToast]);
  // Object manipulation
  const duplicateObject = useCallback(() => {
    if (!canvas || !activeObject) return;

    activeObject.clone((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        data: { type: 'userContent' } // Mark as user content
      }); canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.bringObjectForward(cloned); // Ensure duplicated object is on top
      canvas.renderAll();
      saveToHistory();
    });
  }, [canvas, activeObject, saveToHistory]);

  const deleteObject = useCallback(() => {
    if (!canvas || !activeObject) return;

    canvas.remove(activeObject);
    canvas.renderAll();
    setActiveObject(null);
    saveToHistory();
  }, [canvas, activeObject, saveToHistory]);

  const lockObject = useCallback(() => {
    if (!activeObject) return;

    activeObject.set({
      selectable: false,
      evented: false
    });
    canvas?.renderAll();
    setActiveObject(null);
  }, [canvas, activeObject]); const bringObjectForward = useCallback(() => {
    if (!canvas || !activeObject) return;

    // Get all objects on canvas
    const allObjects = canvas.getObjects();
    // Calculate the highest z-index currently used (which is the length - 1)
    const maxZIndex = allObjects.length - 1;    // Move active object to highest z-index
    canvas.moveObjectTo(activeObject, maxZIndex);
    canvas.renderAll();
    saveToHistory();
    console.log('Brought object to front with z-index:', maxZIndex);
  }, [canvas, activeObject, saveToHistory]);
  const sendToBack = useCallback(() => {
    if (!canvas || !activeObject) return;

    canvas.sendObjectToBack(activeObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, activeObject, saveToHistory]);

  const flipHorizontal = useCallback(() => {
    if (!activeObject) return;

    activeObject.set('flipX', !activeObject.flipX);
    canvas?.renderAll();
    saveToHistory();
  }, [canvas, activeObject, saveToHistory]);

  const flipVertical = useCallback(() => {
    if (!activeObject) return;

    activeObject.set('flipY', !activeObject.flipY);
    canvas?.renderAll();
    saveToHistory();
  }, [canvas, activeObject, saveToHistory]);

  // Canvas operations
  const clearCanvas = useCallback(() => {
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
      setActiveObject(null);
      saveToHistory();
    }
  }, [canvas, saveToHistory]);

  const zoomIn = useCallback(() => {
    if (!canvas) return;
    const newZoom = Math.min(zoom * 1.1, 3);
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.renderAll();
  }, [canvas, zoom]);

  const zoomOut = useCallback(() => {
    if (!canvas) return;
    const newZoom = Math.max(zoom * 0.9, 0.1);
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.renderAll();
  }, [canvas, zoom]);
  const resetZoom = useCallback(() => {
    if (!canvas) return;

    // Reset zoom to 100%
    setZoom(1);
    canvas.setZoom(1);

    // Reset viewport to center
    if (canvas.width && canvas.height) {
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    }

    canvas.renderAll();
    console.log('Zoom reset to 100%');
  }, [canvas]);
  // History operations
  const undo = useCallback(() => {
    if (historyIndex > 0 && canvas) {
      try {
        const newIndex = historyIndex - 1;
        const state = history[newIndex];

        if (state) {
          canvas.loadFromJSON(JSON.parse(state.state), () => {
            // After loading, ensure proper object selection and rendering
            canvas.renderAll();
            setHistoryIndex(newIndex);

            // Make sure active object is properly set
            const activeObj = canvas.getActiveObject();
            if (activeObj) {
              // Ensure properties are properly set
              setActiveObject(activeObj);

              // If it's a text object, ensure it's editable in text mode
              if (activeObj.type === 'text' && canvasMode === 'text') {
                activeObj.set('editable', true);
              }
            } else {
              setActiveObject(null);
            }            // Update layers panel
            if (!isInitializingRef.current) {
              setLayers([...canvas.getObjects()]);
            }

            // Re-apply layer ordering
            setTimeout(() => {
              ensureUserContentOnTop();
            }, 50);
          });
        }
      } catch (error) {
        console.error('Error undoing:', error);
      }
    }
  }, [canvas, historyIndex, history, canvasMode, ensureUserContentOnTop]);
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && canvas) {
      try {
        const newIndex = historyIndex + 1;
        const state = history[newIndex];

        if (state) {
          canvas.loadFromJSON(JSON.parse(state.state), () => {
            // After loading, ensure proper object selection and rendering
            canvas.renderAll();
            setHistoryIndex(newIndex);

            // Make sure active object is properly set
            const activeObj = canvas.getActiveObject();
            if (activeObj) {
              // Ensure properties are properly set
              setActiveObject(activeObj);

              // If it's a text object, ensure it's editable in text mode
              if (activeObj.type === 'text' && canvasMode === 'text') {
                activeObj.set('editable', true);
              }
            } else {
              setActiveObject(null);
            }            // Update layers panel
            if (!isInitializingRef.current) {
              setLayers([...canvas.getObjects()]);
            }

            // Re-apply layer ordering
            setTimeout(() => {
              ensureUserContentOnTop();
            }, 50);
          });
        }
      } catch (error) {
        console.error('Error redoing:', error);
      }
    }
  }, [canvas, historyIndex, history, canvasMode, ensureUserContentOnTop]);

  // Update object properties
  const updateActiveObjectProperty = useCallback((property: string, value: any) => {
    if (!activeObject) return;

    activeObject.set(property, value);
    canvas?.renderAll();
    saveToHistory();
  }, [canvas, activeObject, saveToHistory]);

  // Export operations
  const downloadDesign = useCallback(() => {
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [canvas]);

  const downloadJSON = useCallback(() => {
    if (!canvas) return;

    const dataStr = JSON.stringify(canvas.toJSON(), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.download = 'design.json';
    link.href = url;
    link.click();
  }, [canvas]);

  // Enhanced design complexity analysis
  const analyzeDesignComplexity = useCallback(() => {
    if (!canvas) return {
      complexity: 'simple' as const,
      colorCount: 1,
      needsVectorization: true,
      estimatedFees: { vectorization: 30, complexity: 0 }
    };

    const objects = canvas.getObjects();
    const hasImages = objects.some((obj: any) => obj.type === 'image');
    const hasComplexShapes = objects.some((obj: any) => ['path', 'group'].includes(obj.type || ''));
    const hasText = objects.some((obj: any) => obj.type === 'text');
    const hasDrawing = objects.some((obj: any) => obj.type === 'path' && obj.path);

    // Count unique colors more accurately
    const colors = new Set<string>();
    const gradients = new Set<string>();

    objects.forEach((obj: any) => {
      // Handle fill colors
      if (obj.fill) {
        if (typeof obj.fill === 'string') {
          colors.add(obj.fill);
        } else if (obj.fill.type) {
          // It's a gradient
          gradients.add('gradient');
          if (obj.fill.colorStops) {
            obj.fill.colorStops.forEach((stop: any) => colors.add(stop.color));
          }
        }
      }

      // Handle stroke colors
      if (obj.stroke && typeof obj.stroke === 'string') {
        colors.add(obj.stroke);
      }

      // Handle text colors
      if (obj.type === 'text' && obj.fill && typeof obj.fill === 'string') {
        colors.add(obj.fill);
      }
    });

    const colorCount = Math.max(colors.size, 1);
    const hasGradients = gradients.size > 0;

    // Enhanced complexity calculation
    const complexityScore = [
      objects.length > 5,
      colorCount > 3,
      hasImages,
      hasComplexShapes,
      hasGradients,
      hasDrawing,
      hasText && objects.filter((obj: any) => obj.type === 'text').length > 2
    ].filter(Boolean).length;

    const complexity = complexityScore >= 2 ? 'complex' as const : 'simple' as const;

    // Calculate estimated fees
    const needsVectorization = true; // Canvas designs always need vectorization
    const vectorizationFee = complexity === 'complex' ? 50 : 30;
    const complexityFee = colorCount > 3 || hasGradients ? 25 : 0;

    return {
      complexity,
      colorCount,
      needsVectorization,
      estimatedFees: {
        vectorization: vectorizationFee,
        complexity: complexityFee
      }
    };
  }, [canvas]);

  // Color validation function for spot colors only
  const validateDesignColors = useCallback(async () => {
    if (!canvas) return { isValid: false, message: 'No canvas available', colorCount: 0 };

    const objects = canvas.getObjects().filter((obj: any) =>
      obj.data?.type !== 'background' // Exclude background objects
    );

    if (objects.length === 0) {
      return { isValid: false, message: 'Please add some design elements first', colorCount: 0 };
    }
    const solidColors = new Set<string>();
    let hasGradients = false;
    let hasComplexImages = false;
    const imageColors = new Set<string>();

    // Helper function to extract dominant colors from an image
    const extractImageColors = (imageObj: any): Promise<string[]> => {
      return new Promise((resolve) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx || !imageObj._element) {
            resolve([]);
            return;
          }

          const img = imageObj._element;
          canvas.width = Math.min(img.width, 100); // Sample smaller area for performance
          canvas.height = Math.min(img.height, 100);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          const colorCounts = new Map<string, number>();

          // Sample every 4th pixel for performance
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Skip transparent pixels
            if (a < 128) continue;

            // Convert to hex
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
          }

          // Get the most common colors (more than 5% of pixels)
          const totalPixels = canvas.width * canvas.height / 4; // We sampled every 4th pixel
          const threshold = totalPixels * 0.05;
          const dominantColors = Array.from(colorCounts.entries())
            .filter(([, count]) => count > threshold)
            .map(([color]) => color)
            .slice(0, 10); // Limit to top 10 colors

          resolve(dominantColors);
        } catch (error) {
          console.error('Error extracting image colors:', error);
          resolve([]);
        }
      });
    };

    // Process objects and collect color information
    for (const obj of objects) {
      // Check for images and analyze their colors
      if (obj.type === 'image') {
        try {
          const colors = await extractImageColors(obj);
          if (colors.length > 2) {
            hasComplexImages = true;
          }
          colors.forEach(color => imageColors.add(color.toLowerCase()));
        } catch (error) {
          console.error('Error analyzing image colors:', error);
          hasComplexImages = true; // Assume complex if we can't analyze
        }
        continue;
      }

      // Check fill colors
      if (obj.fill) {
        if (typeof obj.fill === 'string') {
          // Solid color
          solidColors.add(obj.fill.toLowerCase());
        } else {
          // Gradient or pattern
          hasGradients = true;
        }
      }

      // Check stroke colors
      if (obj.stroke && typeof obj.stroke === 'string') {
        solidColors.add(obj.stroke.toLowerCase());
      }
    }    // Remove white and transparent colors from count
    const validSolidColors = Array.from(solidColors).filter(color =>
      color !== '#ffffff' &&
      color !== '#fff' &&
      color !== 'white' &&
      color !== 'transparent' &&
      color !== 'rgba(0,0,0,0)'
    );

    const validImageColors = Array.from(imageColors).filter(color =>
      color !== '#ffffff' &&
      color !== '#fff' &&
      color !== 'white' &&
      color !== 'transparent' &&
      color !== 'rgba(0,0,0,0)'
    );

    // Combine solid colors and image colors
    const allValidColors = new Set([...validSolidColors, ...validImageColors]);
    const colorCount = allValidColors.size;

    // Validation rules
    if (hasComplexImages) {
      return {
        isValid: false,
        message: 'Complex images with more than 2 colors are not allowed for spot color printing. Please use simple images or solid colors only.',
        colorCount
      };
    }

    if (hasGradients) {
      return {
        isValid: false,
        message: 'Gradients are not allowed. Please use only solid spot colors.',
        colorCount
      };
    }

    if (colorCount === 0) {
      return {
        isValid: false,
        message: 'Please add at least one design element with color.',
        colorCount
      };
    }

    if (colorCount > 2) {
      return {
        isValid: false,
        message: `Too many colors (${colorCount}). Maximum 2 solid spot colors allowed. This includes colors from images.`,
        colorCount
      };
    }

    return {
      isValid: true,
      message: `Design validated! ${colorCount} spot color${colorCount > 1 ? 's' : ''} detected${imageColors.size > 0 ? ' (including colors from images)' : ''}.`,
      colorCount
    };
  }, [canvas]);
  // Handle validation
  const handleValidateDesign = useCallback(async () => {
    setIsValidating(true);
    try {
      const result = await validateDesignColors();
      setValidationResult(result);

      if (result.isValid) {
        // Generate design hash after successful validation
        const canvasData = canvas.toJSON();
        const designHash = generateDesignHash(canvasData);
        setCurrentDesignHash(designHash);

        // Check if this design has been printed before
        const hasBeenPrinted = await checkDesignHistory(designHash);

        if (hasBeenPrinted) {
          // Design has been printed before - skip plate fee
          setIsFirstTimePrinting(false);
          setShowAddToCart(true);
        } else {
          // New design - show first-time printing dialog
          setShowFirstTimePrintingDialog(true);
        }
      } else {
        setShowAddToCart(false);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        isValid: false,
        message: 'Validation failed. Please try again.',
        colorCount: 0
      });
    } finally {
      setIsValidating(false);
    }
  }, [validateDesignColors, canvas, generateDesignHash, checkDesignHistory]);

  // Handle preview modal
  const handleShowPreview = useCallback(() => {
    if (!canvas) return;
    setShowPreviewModal(true);
  }, [canvas]);
  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (!canvas || !validationResult?.isValid) return;

    const designData: DesignData = {
      canvasData: canvas.toJSON(),
      previewImage: canvas.toDataURL('image/png'),
      complexity: 'simple', // Validated designs are always simple
      colorCount: validationResult.colorCount,
      needsVectorization: true,
      estimatedFees: {
        vectorization: 30,
        complexity: 0
      }
    };    // Prepare extra fees for customized design
    const extraFees = [
      {
        label: 'Vectorization Fee',
        amount: validationResult.colorCount === 1 ? 30 : 50
      }
    ];

    // Add plate setup fee for first-time printing
    if (isFirstTimePrinting) {
      extraFees.push({
        label: 'Plate Setup Fee',
        amount: 100
      });
    }

    // Create a unique cart item ID for customized products
    const cartItemId = `${product.id}-custom-${Date.now()}`;

    // Create a cart item following the CartItem interface
    const cartItem = {
      id: cartItemId,
      name: product.title,
      price: product.minPrice,
      quantity: product.quantity || 1,
      image: designData.previewImage, // Use the design preview as the image
      productType: product.productType,
      options: {
        // Add default selections or could be made configurable
        size: product.bagSize || 'standard',
        color: product.printColor || 'one-color-one-side',
        customDesign: true,
        colorCount: validationResult.colorCount,
        designHash: currentDesignHash, // Store design hash for repeat order detection
        isFirstTimePrinting: isFirstTimePrinting
      },
      customized: true,
      extraFees: extraFees.filter(fee => fee.amount > 0) // Only include fees with amounts > 0
    };

    // Add to cart
    addToCart(cartItem);

    // Call the design ready callback for any additional processing
    onDesignReady(designData);

    // Show feedback to the user
    const msg = `Added custom ${product.title} to cart`;
    addToast({
      message: msg,
      type: 'success',
      duration: 3000
    });    // Close modal after adding to cart
    onClose();
  }, [canvas, validationResult, product, onDesignReady, onClose, addToCart, addToast, isFirstTimePrinting, currentDesignHash]);

  // Toggle background visibility
  const toggleBackgroundVisibility = useCallback(() => {
    if (!canvas) return;

    console.log('Toggling background visibility from', showBackground);

    // Toggle visibility state
    const newVisibility = !showBackground;
    setShowBackground(newVisibility);

    // Find background objects
    const backgroundObjects = canvas.getObjects().filter((obj: any) =>
      obj.data && obj.data.type === 'background'
    );

    console.log(`Found ${backgroundObjects.length} background objects to toggle`);

    // Toggle their visibility
    backgroundObjects.forEach((obj: any) => {
      obj.set('visible', newVisibility);
    });

    canvas.renderAll();

    // Ensure proper layer order
    ensureUserContentOnTop();
  }, [canvas, showBackground, ensureUserContentOnTop]);
  // Sort and enhance layers for better display
  const getSortedLayers = useCallback(() => {
    if (!canvas) return [];

    // Get all canvas objects
    const allObjects = canvas.getObjects();

    // Create an enhanced array with additional metadata
    const enhancedLayers = allObjects.map((obj: any, index: number) => {
      const isBackground = obj.data?.type === 'background';
      const isUserContent = obj.data?.type === 'userContent';
      // Use the array index as z-index since getItemIndex doesn't exist in Fabric.js v6
      const zIndex = index;

      return {
        object: obj,
        isBackground,
        isUserContent,
        zIndex,
        type: obj.type
      };
    });

    // Sort by z-index, so top objects appear first
    return [...enhancedLayers].sort((a, b) => b.zIndex - a.zIndex);
  }, [canvas]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg w-full  h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Advanced Design Editor</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadDesign}>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={downloadJSON}>
              <Save className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button variant="outline" onClick={onClose}>×</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="ml-4">Loading advanced editor...</p>
            </div>
          ) : (
            <div className="h-full flex gap-4">
              {/* Tools Panel */}
              <div className="w-64 border rounded-lg p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Tools</h3>

                {/* Mode Selection */}
                <div className="mb-4">
                  {/* <label className="block text-sm font-medium mb-2">Mode:</label> */}
                  <div className="">
                  {/* <div className="grid grid-cols-3 gap-1"> */}
                    {/* <Button
                      variant={canvasMode === 'select' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCanvasMode('select')}
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button> */}
                    {/* <Button
                      variant={canvasMode === 'drawing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCanvasMode('drawing')}
                    >
                      <Settings className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant={canvasMode === 'text' ? 'outline' : 'default'}
                      size="lg"
                      onClick={() => setCanvasMode('text')}
                    >
                      {/* <Type className="h-4 w-4" /> */}
                      Start Design
                    </Button>
                  </div>
                </div>

                {/* Basic Shapes */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium">Shapes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={addText}>
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={addRectangle}>
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={addCircle}>
                      <Circle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={addTriangle}>
                      <Triangle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={addLine}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={addStar}>
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>                {/* Image Upload */}
                <div className="mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start mb-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  
                  {/* Color Validation Button */}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      if (activeObject && activeObject.type === 'image' && activeObject._element) {
                        // Get the image element from the fabric object
                        const imgEl = activeObject._element;
                        
                        // Convert the image to a File object
                        fetch(imgEl.src)
                          .then(res => res.blob())
                          .then(blob => {
                            const file = new File([blob], 'selected-image.png', { type: blob.type });
                            setCurrentImageFile(file);
                            analyzeImage(file).then(() => {
                              setShowColorValidationModal(true);
                            });
                          });                      } else {
                        addToast({
                          message: 'No image selected. Please select an image on the canvas first',
                          type: 'info',
                          duration: 3000
                        });
                      }
                    }}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Validate Image Colors
                  </Button>
                </div>

                {/* Colors */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Colors</h4>
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full h-8 rounded border"
                      title="Fill Color"
                    />
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-full h-8 rounded border"
                      title="Stroke Color"
                    />
                  </div>
                </div>

                {/* Text Properties */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Text</h4>
                  <div className="space-y-2">
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full p-1 border rounded text-sm"
                    >
                      {fontFamilies.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    <input
                      type="range"
                      min="8"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-600">Size: {fontSize}px</span>
                  </div>
                </div>

                {/* Stroke Width */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Stroke</h4>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600">Width: {strokeWidth}px</span>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 border rounded-lg flex flex-col">
                {/* Canvas Toolbar */}
                <div className="border-b p-2 flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                      <Redo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={duplicateObject} disabled={!activeObject}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={deleteObject} disabled={!activeObject}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={flipHorizontal} disabled={!activeObject}>
                      <FlipHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={flipVertical} disabled={!activeObject}>
                      <FlipVertical className="h-4 w-4" />
                    </Button>                    <Button variant="outline" size="sm" onClick={bringObjectForward} disabled={!activeObject} title="Bring forward">
                      <Layers className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={sendToBack} disabled={!activeObject}>
                      <Move className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={zoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetZoom}>
                      {Math.round(zoom * 100)}%
                    </Button>
                    <Button variant="outline" size="sm" onClick={zoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleBackgroundVisibility}
                      title={`${showBackground ? 'Hide' : 'Show'} background`}                    >
                      {showBackground ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 overflow-y-auto  ">
                  <div className="border-2 border-gray-300 border-dashed p-4 bg-white rounded mt-20">
                    <canvas
                      ref={canvasRef}
                      className="border shadow-lg"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="w-64 border rounded-lg p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Properties</h3>

                {/* Object Properties */}
                {activeObject && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Object Type:</label>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">{activeObject.type}</span>
                    </div>

                    {activeObject.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Text:</label>
                        <input
                          type="text"
                          value={activeObject.text || ''}
                          onChange={(e) => updateActiveObjectProperty('text', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                        />
                      </div>
                    )}                    <div>
                      <label className="block text-sm font-medium mb-1">Fill Color:</label>
                      <input
                        type="color"
                        value={typeof activeObject.fill === 'string' ? activeObject.fill : '#000000'}
                        onChange={(e) => updateActiveObjectProperty('fill', e.target.value)}
                        className="w-full h-8 rounded border"
                      />
                      {typeof activeObject.fill !== 'string' && (
                        <p className="text-xs text-amber-500 mt-1">
                          Complex fill (gradient/pattern) detected. Use the color picker to replace with a solid color.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Opacity:</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={activeObject.opacity || 1}
                        onChange={(e) => updateActiveObjectProperty('opacity', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-600">{Math.round((activeObject.opacity || 1) * 100)}%</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={lockObject}>
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={deleteObject}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}                {/* Layers */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Layers ({layers.length})</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {getSortedLayers().map((layer, index) => {
                      const obj = layer.object;
                      const layerClass =
                        activeObject === obj ? 'bg-blue-100 border-blue-300' :
                          layer.isBackground ? 'bg-gray-100' :
                            layer.isUserContent ? 'bg-green-50' : 'bg-gray-50';

                      return (
                        <div
                          key={index}
                          className={`p-2 text-xs border rounded cursor-pointer flex justify-between items-center ${layerClass}`}
                          onClick={() => {
                            canvas?.setActiveObject(obj);
                            canvas?.renderAll();
                            setActiveObject(obj);
                          }}
                        >
                          <span>
                            {layer.type} {layer.zIndex + 1}
                            {layer.isBackground && ' (bg)'}
                            {layer.isUserContent && ' (user)'}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newVisibility = !obj.visible;
                                obj.set('visible', newVisibility);

                                // If making an object visible, also ensure it's properly positioned in layer stack
                                if (newVisibility && obj.data?.type === 'userContent') {
                                  // Call once immediately and once after a small delay
                                  ensureUserContentOnTop();
                                  setTimeout(ensureUserContentOnTop, 50);
                                } canvas?.renderAll();
                                // Update layer panel to reflect changes
                                if (!isInitializingRef.current) {
                                  setLayers([...canvas.getObjects()]);
                                }
                              }}
                            >
                              {obj.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Design Info */}
                <div className="mt-6 bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium mb-2">Design Info</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Objects: {layers.length}</p>
                    <p>Colors: {analyzeDesignComplexity().colorCount}</p>
                    <p>Complexity: {analyzeDesignComplexity().complexity}</p>
                    <p>Zoom: {Math.round(zoom * 100)}%</p>
                  </div>
                </div>

                {/* Canvas Actions */}
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full" onClick={clearCanvas}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button variant="outline" className="w-full" onClick={toggleBackgroundVisibility}>
                    {showBackground ? 'Hide' : 'Show'} Background
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShowPreview}>
              Preview
            </Button>
            {!validationResult?.isValid ? (
              <Button
                onClick={handleValidateDesign}
                disabled={isValidating || !canvas}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </Button>
            ) : showAddToCart ? (
              <Button
                onClick={handleAddToCart}
                disabled={!canvas}
                className="bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            ) : null}
          </div>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <div className={`p-3 border-t ${validationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                {validationResult.message}
              </span>            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && canvas && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60" onClick={() => setShowPreviewModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Design Preview</h3>
              <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              {/* Canvas Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Current Design</h4>
                <div className="flex justify-center">
                  <img
                    src={canvas.toDataURL('image/png')}
                    alt="Design Preview"
                    className="max-w-full h-auto border shadow-sm rounded"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>

              {/* Product Mockup Preview */}
              {product?.mockupImages && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Product Preview</h4>                    <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={product.mockupImages.front}
                        alt={`${product.title} mockup`}
                        className="max-w-full h-auto border shadow-sm rounded"
                        style={{ maxHeight: '300px' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={canvas.toDataURL('image/png')}
                          alt="Design on Product"
                          className="w-24 h-24 opacity-80"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design Info */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Design Information</h4>
                <div className="text-sm space-y-1">
                  <p>Objects: {layers.length}</p>
                  <p>Colors: {analyzeDesignComplexity().colorCount}</p>
                  <p>Complexity: {analyzeDesignComplexity().complexity}</p>
                </div>
              </div>
            </div>
          </div>        </div>
      )}

      {/* First-Time Printing Dialog */}
      {showFirstTimePrintingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-70" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">First-Time Printing</h3>
              <p className="text-gray-600 mb-6">
                Is this your first time printing this design? First-time designs require plate setup and incur a £100 setup fee.
              </p>

              {isCheckingDesignHistory && (
                <div className="mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Checking design history...</p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFirstTimePrinting(false);
                    setShowFirstTimePrintingDialog(false);
                    setShowAddToCart(true);
                  }}
                  disabled={isCheckingDesignHistory}
                >
                  No, I&apos;ve printed this before
                </Button>
                <Button
                  onClick={() => {
                    setIsFirstTimePrinting(true);
                    setShowFirstTimePrintingDialog(false);
                    setShowAddToCart(true);
                  }}
                  disabled={isCheckingDesignHistory}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Yes, this is a new design
                </Button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <p className="font-medium">Note:</p>
                <p>All artwork will be manually reviewed after checkout before making plates.</p>
              </div>
            </div>
          </div>
        </div>      )}
      
      {/* Color Validation Modal */}
      <ColorValidationModal
        isOpen={showColorValidationModal}
        onClose={() => setShowColorValidationModal(false)}
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onSimplifyImage={handleSimplifyImage}
      />
    </div>
  );
};

export default FabricEditor;
