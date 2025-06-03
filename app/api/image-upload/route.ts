import { NextRequest, NextResponse } from 'next/server';

const IMAGEBB_API_KEY = process.env.IMAGEBB_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!IMAGEBB_API_KEY) {
      return NextResponse.json(
        { error: 'ImageBB API key is not configured' },
        { status: 500 }
      );
    }    const formDataForImageBB = new FormData();
    const buffer = await image.arrayBuffer();
    const blob = new Blob([buffer], { type: image.type });
    formDataForImageBB.append('image', blob, image.name);
    formDataForImageBB.append('key', IMAGEBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formDataForImageBB,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    return NextResponse.json({
      success: true,
      url: data.data.url,
      thumbnail: data.data.thumb?.url || data.data.url,
      displayUrl: data.data.display_url,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
