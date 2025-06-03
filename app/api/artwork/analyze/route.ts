/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('artwork') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No artwork file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Analyze image using Sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    // Resize and analyze colors
    const resizedImage = await image
      .resize(200, 200)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Basic color analysis - count unique colors
    const { data, info } = resizedImage;
    const colorSet = new Set<string>();
    
    // Sample pixels to analyze colors (every 10th pixel for performance)
    for (let i = 0; i < data.length; i += (info.channels * 10)) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Group similar colors to reduce noise
      const roundedR = Math.round(r / 32) * 32;
      const roundedG = Math.round(g / 32) * 32;
      const roundedB = Math.round(b / 32) * 32;
      
      colorSet.add(`${roundedR},${roundedG},${roundedB}`);
    }

    const colorCount = colorSet.size;
    const isComplex = colorCount > 3; // More than 3 colors is considered complex
    const hasGradients = colorCount > 10; // Lots of colors likely means gradients
    
    // Determine complexity based on multiple factors
    const complexity = isComplex || hasGradients || (metadata.width && metadata.width > 2000) ? 'complex' : 'simple';
    
    // File type analysis
    const fileType = file.type;
    const isVector = fileType.includes('svg') || file.name.toLowerCase().endsWith('.ai') || file.name.toLowerCase().endsWith('.eps');
    const needsVectorization = !isVector && (fileType.includes('png') || fileType.includes('jpg') || fileType.includes('jpeg'));

    return NextResponse.json({
      colorCount,
      complexity,
      isVector,
      needsVectorization,
      fileType,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      },
      fileSize: file.size,
      analysis: {
        hasGradients,
        isHighRes: metadata.width && metadata.width > 1920
      }
    });

  } catch (error: any) {
    console.error('Error analyzing artwork:', error);
    return NextResponse.json(
      { error: 'Failed to analyze artwork: ' + error.message },
      { status: 500 }
    );
  }
}
