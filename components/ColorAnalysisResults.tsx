import React from 'react';
import { ColorAnalysis } from '@/hooks/useColorExtraction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Hash, Eye, Grid } from 'lucide-react';
import { ColorDisplay, ColorPalette } from './ColorDisplay';

interface ColorAnalysisResultsProps {
    analysis: ColorAnalysis;
}

export const ColorAnalysisResults: React.FC<ColorAnalysisResultsProps> = ({ analysis }) => {
    return (
        <div className="space-y-6">
            {/* Image Type Warning/Info */}
            {analysis.imageType !== 'spot-color' && (
                <div className={`p-4 rounded-lg border ${analysis.imageType === 'full-color'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${analysis.imageType === 'full-color' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                        <p className={`font-medium ${analysis.imageType === 'full-color' ? 'text-red-700' : 'text-yellow-700'
                            }`}>
                            {analysis.imageType === 'full-color'
                                ? 'Full-Color Image Detected'
                                : 'Gradient Image Detected'}
                        </p>
                    </div>          <p className={`text-sm ${analysis.imageType === 'full-color' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                        {analysis.imageType === 'full-color'
                            ? `This image contains ${analysis.totalColors} colors and is not suitable for spot color printing. Only images with exactly 1 or 2 solid colors are accepted.`
                            : `This image contains ${analysis.totalColors} colors. For spot color printing, only images with exactly 1 or 2 solid colors are accepted.`}
                    </p>
                </div>
            )}      {/* Spot Color Success Message */}
            {analysis.isSpotColor && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <p className="text-green-700 font-medium">Perfect Spot Color! ✓</p>
                    </div>
                    <p className="text-green-600 text-sm">
                        This image contains exactly {analysis.spotColorCount} solid color{analysis.spotColorCount > 1 ? 's' : ''} and is perfect for spot color printing.
                    </p>
                </div>
            )}

            {/* Summary Stats */}      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <Hash className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold text-gray-900">
                            {analysis.totalColors.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Unique Colors</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <Palette className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold text-gray-900">
                            {analysis.spotColorCount}
                        </div>
                        <div className="text-sm text-gray-600">Spot Colors</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold text-gray-900">
                            {analysis.palette.length}
                        </div>
                        <div className="text-sm text-gray-600">Dominant Colors</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <Grid className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                        <div className={`text-2xl font-bold ${analysis.isSpotColor ? 'text-green-600' :
                            analysis.imageType === 'gradient' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {analysis.imageType.toUpperCase().replace('-', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">Image Type</div>
                    </CardContent>
                </Card>
            </div>

            {/* Dominant Color */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Dominant Color
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center">
                        <ColorDisplay
                            color={analysis.dominantColor}
                            size="large"
                            showDetails={true}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Color Palette */}
            <ColorPalette
                colors={analysis.palette}
                title="🎨 Color Palette (Most Prominent Colors)"
                maxDisplay={10}
            />

            {/* Sample of Unique Colors */}
            <ColorPalette
                colors={analysis.uniqueColors}
                title="🔍 Sample of Detected Colors"
                maxDisplay={20}
            />

            {/* Color Distribution Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Grid className="w-5 h-5" />
                        Color Analysis Details
                    </CardTitle>
                </CardHeader>        <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total unique colors found:</span>
                            <span className="font-semibold">{analysis.totalColors.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Dominant colors extracted:</span>
                            <span className="font-semibold">{analysis.palette.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Spot colors identified:</span>
                            <span className="font-semibold">{analysis.spotColorCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Image classification:</span>
                            <span className={`font-semibold ${analysis.isSpotColor ? 'text-green-600' :
                                analysis.imageType === 'gradient' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {analysis.imageType.toUpperCase().replace('-', ' ')}
                            </span>
                        </div>
                        <hr className="my-2" />                        <div className="space-y-2">
                            <p className="text-gray-600 italic">
                                <strong>Strict Spot Color Validation:</strong> Only images with exactly 1 or 2 total unique colors are accepted for spot color printing.
                                Any additional colors (from anti-aliasing, gradients, or compression) disqualify the image.
                            </p>
                            {analysis.totalColors > 2 && !analysis.isSpotColor && (
                                <p className="text-red-600 italic text-sm">
                                    <strong>Rejected:</strong> This image has {analysis.totalColors} unique colors.
                                    To make it spot color compatible, use only solid colors without anti-aliasing, gradients, or effects.
                                </p>
                            )}
                            {analysis.isSpotColor && (
                                <p className="text-green-600 italic text-sm">
                                    <strong>Approved:</strong> This image meets the strict criteria with exactly {analysis.totalColors} unique color{analysis.totalColors > 1 ? 's' : ''}.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
