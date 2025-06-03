/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import Customization from '@/lib/models/customization';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const {
      productId,
      productTitle,
      artworkData,
      customizationOptions,
      pricing,
      userId,
      sessionId
    } = await req.json();

    // Validate required fields
    if (!productId || !artworkData || !pricing) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate design hash for deduplication
    const designString = JSON.stringify({
      productId,
      artworkData: artworkData.canvasData || artworkData.previewImageUrl,
      customizationOptions
    });
    const designHash = crypto.createHash('sha256').update(designString).digest('hex');

    // Check if design already exists
    const existingCustomization = await Customization.findOne({ designHash });
    
    if (existingCustomization) {
      // Update existing customization
      existingCustomization.pricing = pricing;
      existingCustomization.status = 'validated';
      existingCustomization.updatedAt = new Date();
      
      await existingCustomization.save();
      
      return NextResponse.json({
        customizationId: existingCustomization._id,
        designHash,
        isFirstTime: existingCustomization.printHistory.length === 0,
        message: 'Customization updated'
      });
    }

    // Create new customization
    const customization = new Customization({
      userId,
      sessionId: sessionId || `session_${Date.now()}`,
      productId,
      productTitle,
      designHash,
      artworkData,
      customizationOptions,
      pricing,
      status: 'validated'
    });

    await customization.save();

    return NextResponse.json({
      customizationId: customization._id,
      designHash,
      isFirstTime: true,
      message: 'Customization saved successfully'
    });

  } catch (error) {
    console.error('Error saving customization:', error);
    return NextResponse.json(
      { error: 'Failed to save customization' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const designHash = url.searchParams.get('designHash');
    const userId = url.searchParams.get('userId');
    const sessionId = url.searchParams.get('sessionId');    if (!designHash && !userId && !sessionId) {
      return NextResponse.json(
        { error: 'Missing search parameters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const query: any = {};
    
    if (designHash) {
      query.designHash = designHash;
    } else if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    }

    const customizations = await Customization.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      customizations,
      count: customizations.length
    });

  } catch (error) {
    console.error('Error fetching customizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customizations' },
      { status: 500 }
    );
  }
}
