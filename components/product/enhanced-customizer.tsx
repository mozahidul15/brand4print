// "use client";

// import React, { useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { useCart } from '@/components/cart';
// import { useOrderHistory } from '@/components/order-history/order-history-context';
// import { CustomizationProvider, useCustomization } from './customization-context';
// import Image from 'next/image';
// import {
//   Upload,
//   AlertTriangle,
//   CheckCircle,
//   Edit3,
//   FileType,
//   Palette,
//   DollarSign,
//   Clock,
//   Info
// } from 'lucide-react';
// import FabricEditor from './fabric-editor';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// interface Product {
//   id: string;
//   title: string;
//   productType: string;
//   mockupImages?: {
//     front: string;
//     back?: string;
//   },
//   minPrice: number;
//   maxPrice: number;
//   quantity: number;
//   bagSize?: string;
//   printColor?: string;

// }

// interface EnhancedCustomizerProps {
//   product: Product;
//   onClose: () => void;
// }

// const EnhancedCustomizerContent: React.FC<EnhancedCustomizerProps> = ({ product, onClose }) => {
//   const { addToCart } = useCart();
//   const { hasDesignBeenPrinted } = useOrderHistory();
//   const { state, updateState, analyzeArtwork, proceedToNextStep } = useCustomization();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [showFabricEditor, setShowFabricEditor] = useState(false);  // Initialize with values from the product page and skip to upload step
//   React.useEffect(() => {
//     // Get values from the product passed as props
//     updateState({
//       productId: product.id,
//       basePrice: product.minPrice,
//       selectedSize: product.options.bagSizes?.[0]?.id || '',
//       selectedPrintOption: product.options.printColors?.[0]?.id || '',
//       step: 'upload' // Skip to upload step immediately
//     });
//   }, [product, updateState]);

//   // Step 2: File Upload and Analysis
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       await analyzeArtwork(file);
//       proceedToNextStep();
//     }
//   };

//   // Step 3: First Time Printing Question
//   const handleFirstTimePrinting = (isFirstTime: boolean) => {
//     updateState({ isFirstTimePrinting: isFirstTime });
//     // Check if design has been printed before
//     if (state.uploadedFile) {
//       // Here you would generate a hash of the design to check history
//       // For now, we'll use the filename as a simple check
//       const hasBeenPrinted = hasDesignBeenPrinted(state.uploadedFile.name, product.title);
//       updateState({ isFirstTimePrinting: isFirstTime && !hasBeenPrinted });
//     }
//     proceedToNextStep();
//   };

//   // Handle design from Fabric.js Editor
//   const handleDesignReady = (designData: { canvasData: object; previewImage: string; complexity: 'simple' | 'complex'; colorCount: number }) => {
//     setShowFabricEditor(false);
//     updateState({
//       designUrl: designData.previewImage,
//       artworkAnalysis: {
//         colorCount: designData.colorCount,
//         complexity: designData.complexity,
//         isVector: false, // Canvas designs are raster
//         needsVectorization: true,
//         fileType: 'image/png',
//         dimensions: { width: 500, height: 500 },
//         fileSize: 0,
//         analysis: {
//           hasGradients: designData.complexity === 'complex',
//           isHighRes: false
//         }
//       }
//     });
//     proceedToNextStep();
//   };
//   // Add to cart with all customization data
//   const addToCartWithCustomization = () => {    // Create extra fees array
//     const extraFees = [];

//     if (state.fees.plateFee > 0) {
//       extraFees.push({ label: 'Plate Fee (First-time)', amount: state.fees.plateFee });
//     }

//     if (state.fees.vectorizationFee > 0) {
//       extraFees.push({ label: 'Vectorization Fee', amount: state.fees.vectorizationFee });
//     }

//     if (state.fees.setupFee > 0) {
//       extraFees.push({ label: 'Setup Fee (High-res)', amount: state.fees.setupFee });
//     }

//     const customItem = {
//       id: `${product.id}-${Date.now()}`, // Unique ID for customized items
//       name: product.title,
//       price: totalPrice, // Include the total price with fees
//       quantity: 1,
//       image: state.designUrl || '/placeholder-image.jpg',
//       productType: 'bag', // Set to bag since this customizer is only used for bags
//       extraFees: extraFees.length > 0 ? extraFees : undefined,
//       customized: true,
//       options: {
//         size: state.selectedSize,
//         color: state.selectedPrintOption,
//         artworkFile: state.uploadedFile?.name,
//         complexity: state.artworkAnalysis?.complexity
//       }
//     };

//     addToCart(customItem);
//     onClose();
//   };

//   const totalPrice = state.basePrice + state.fees.totalAdditionalFees;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">            <span>Upload Artwork for {product.title}</span>
//             <Button variant="outline" onClick={onClose}>×</Button>
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">          {/* Progress Indicator - Skipping the selection step */}
//           <div className="flex items-center space-x-2 text-sm">
//             <div className={`w-3 h-3 rounded-full bg-blue-500`} />
//             <span>Artwork Upload</span>
//             <div className={`w-3 h-3 rounded-full ${['validation', 'firstTime', 'preview'].includes(state.step) ? 'bg-blue-500' : 'bg-gray-300'}`} />
//             <span>Validation</span>
//             <div className={`w-3 h-3 rounded-full ${['firstTime', 'preview'].includes(state.step) ? 'bg-blue-500' : 'bg-gray-300'}`} />
//             <span>Options</span>
//             <div className={`w-3 h-3 rounded-full ${state.step === 'preview' ? 'bg-blue-500' : 'bg-gray-300'}`} />
//             <span>Preview</span>
//           </div>

//           {/* Step 2: Artwork Upload */}
//           {state.step === 'upload' && (
//             <div className="space-y-4">              <h3 className="font-semibold text-lg">Upload Your Artwork</h3>
//               <p className="text-gray-600 mb-4">We&apos;ll print your design exactly as you provide it. Please ensure your artwork is ready for printing.</p>

//               {/* Upload Options */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* File Upload */}
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
//                   <Upload className="mx-auto h-12 w-12 text-purple-500 mb-4" />
//                   <p className="text-gray-700 font-medium mb-2">Upload design file</p>
//                   <p className="text-xs text-gray-500 mb-4">PNG, JPG, SVG, PDF (Max 10MB)</p>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".png,.jpg,.jpeg,.svg,.pdf"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                   <Button className="bg-purple-600 hover:bg-purple-700">
//                     Choose File
//                   </Button>
//                   {state.uploadedFile && (
//                     <p className="mt-2 text-sm text-green-600">
//                       File uploaded: {state.uploadedFile.name}
//                     </p>
//                   )}
//                 </div>                {/* Design Editor */}
//                 <div className="border border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setShowFabricEditor(true)}>
//                   <Edit3 className="mx-auto h-12 w-12 text-blue-500 mb-4" />
//                   <p className="text-gray-700 font-medium mb-2">Create with our editor</p>
//                   <p className="text-xs text-gray-500 mb-4">No design? Create one with our simple drag & drop tool</p>
//                   <Button variant="outline" className="border-blue-300 hover:bg-blue-100">
//                     Open Editor
//                   </Button>
//                 </div>
//               </div>

//               {state.isLoading && (
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-2">Analyzing artwork...</p>
//                 </div>
//               )}

//               {state.error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                   {state.error}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Step 3: Artwork Validation */}
//           {state.step === 'validation' && state.artworkAnalysis?.complexity === 'complex' && (
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2 text-orange-600">
//                 <AlertTriangle className="h-5 w-5" />
//                 <h3 className="font-semibold">Complex Artwork Detected</h3>
//               </div>

//               <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
//                 <p className="text-gray-700 mb-4">
//                   Your artwork contains <span className="font-medium">{state.artworkAnalysis.colorCount} colors</span> or complex elements.
//                   This requires additional processing for optimal printing results.
//                 </p>

//                 <div className="space-y-2 text-sm bg-white p-3 rounded-md mb-4">
//                   <div className="flex items-center space-x-2">
//                     <Palette className="h-4 w-4 text-purple-500" />
//                     <span>Colors detected: <span className="font-medium">{state.artworkAnalysis.colorCount}</span></span>
//                   </div>
//                   {state.artworkAnalysis.analysis.hasGradients && (
//                     <div className="flex items-center space-x-2">
//                       <Info className="h-4 w-4 text-blue-500" />
//                       <span>Contains gradients or complex shading</span>
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-2">
//                     <FileType className="h-4 w-4 text-green-500" />
//                     <span>File type: <span className="font-medium">{state.artworkAnalysis.fileType}</span></span>
//                   </div>
//                 </div>

//                 <p className="text-sm text-orange-700 mb-4">
//                   Complex artwork requires vectorization for best printing results. A one-time fee will be added.
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Button onClick={proceedToNextStep} className="w-full bg-purple-600 hover:bg-purple-700">
//                   Continue with Complex Artwork (+£{state.artworkAnalysis.needsVectorization ? '50' : '30'} vectorization)
//                 </Button>
//                 <Button variant="outline" onClick={() => updateState({ step: 'upload' })} className="w-full">
//                   Upload Simpler Artwork
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Step 4: First Time Printing */}
//           {state.step === 'firstTime' && (
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2 text-green-600">
//                 <CheckCircle className="h-5 w-5" />
//                 <h3 className="font-semibold">Artwork Validated</h3>
//               </div>

//               <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-700 mb-2">First-time printing setup</h4>
//                 <p className="text-gray-700 mb-4">
//                   Is this your first time printing this exact design? First-time designs require
//                   a custom plate setup which includes a one-time £100 fee. You won&apos;t need to pay this fee
//                   for future orders with the same design.
//                 </p>

//                 <div className="space-y-2">
//                   <Button onClick={() => handleFirstTimePrinting(true)} className="w-full bg-blue-600 hover:bg-blue-700">
//                     Yes, this is my first time (+£100 plate fee)
//                   </Button>
//                   <Button variant="outline" onClick={() => handleFirstTimePrinting(false)} className="w-full border-blue-300 hover:bg-blue-50">
//                     No, I&apos;ve printed this design before
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 5: Preview and Checkout */}
//           {state.step === 'preview' && (
//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Order Summary</h3>
//               <div className="border rounded-lg p-4 space-y-3">
//                 <div className="flex justify-between">
//                   <span>Base Price:</span>
//                   <span>£{state.basePrice.toFixed(2)}</span>
//                 </div>

//                 {/* Display selected options */}
//                 <div className="text-sm text-gray-600 border-t pt-2">
//                   <p><span className="font-medium">Bag Size:</span> {
//                     product.options.bagSizes?.find(s => s.id === state.selectedSize)?.label || state.selectedSize
//                   }</p>
//                   <p><span className="font-medium">Print Option:</span> {
//                     product.options.printColors?.find(c => c.id === state.selectedPrintOption)?.label || state.selectedPrintOption
//                   }</p>
//                 </div>

//                 {state.fees.plateFee > 0 && (
//                   <div className="flex justify-between text-orange-600">
//                     <span>Plate Setup Fee (first-time):</span>
//                     <span>+£{state.fees.plateFee.toFixed(2)}</span>
//                   </div>
//                 )}

//                 {state.fees.vectorizationFee > 0 && (
//                   <div className="flex justify-between text-blue-600">
//                     <span>Vectorization Fee:</span>
//                     <span>+£{state.fees.vectorizationFee.toFixed(2)}</span>
//                   </div>
//                 )}

//                 {state.fees.setupFee > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>High-res Setup Fee:</span>
//                     <span>+£{state.fees.setupFee.toFixed(2)}</span>
//                   </div>
//                 )}

//                 <hr />
//                 <div className="flex justify-between font-semibold text-lg">
//                   <span>Total:</span>
//                   <span>£{totalPrice.toFixed(2)}</span>
//                 </div>
//               </div>

//               {/* Artwork Preview */}
//               {(state.designUrl || state.uploadedFile) && (
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium mb-2">Artwork Preview</h4>                  {state.designUrl && (
//                     <div className="relative w-full h-48 max-w-xs mx-auto">
//                       <Image
//                         src={state.designUrl}
//                         alt="Design preview"
//                         className="border rounded"
//                         fill
//                         sizes="(max-width: 768px) 100vw, 300px"
//                         priority
//                         style={{ objectFit: "contain" }}
//                       />
//                     </div>
//                   )}
//                   {state.uploadedFile && !state.designUrl && (
//                     <div className="text-center text-gray-600">
//                       <FileType className="h-12 w-12 mx-auto mb-2" />
//                       <p>{state.uploadedFile.name}</p>
//                     </div>
//                   )}
//                 </div>
//               )}              <Button onClick={addToCartWithCustomization} className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
//                 <DollarSign className="h-4 w-4 mr-2" />
//                 Add to Cart - £{totalPrice.toFixed(2)}
//               </Button>
//             </div>
//           )}          {/* Processing times info */}
//           <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//             <div className="flex items-center space-x-2 mb-3 text-purple-700">
//               <Clock className="h-5 w-5" />
//               <span className="font-medium">Estimated Processing Times</span>
//             </div>
//             <div className="text-sm text-gray-700 space-y-2">
//               <p className="flex items-center">
//                 <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
//                 Simple artwork: 1-2 business days
//               </p>
//               <p className="flex items-center">
//                 <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
//                 Complex artwork: 3-5 business days
//               </p>
//               <p className="flex items-center">
//                 <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
//                 First-time designs: +1 business day for plate setup
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>      {/* Fabric.js Editor Modal */}
//       {showFabricEditor && (
//         <FabricEditor
//           product={{ ...product }}
//           onDesignReady={handleDesignReady}
//           onClose={() => setShowFabricEditor(false)}
//         />
//       )}
//     </div>
//   );
// };

// const EnhancedCustomizer: React.FC<EnhancedCustomizerProps> = (props) => {
//   return (
//     <CustomizationProvider>
//       <EnhancedCustomizerContent {...props} />
//     </CustomizationProvider>
//   );
// };

// export default EnhancedCustomizer;
