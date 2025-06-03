import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import Product from '@/lib/models/product';


/**
 * GET /api/products/[title]
 * Fetch a single product by title
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ title: string }> }
) {

  try {
    const {title: ttl}= await params;
    // Decode the title from URL encoding
    const title = decodeURIComponent(ttl);

    // // First try to get product from the sample data for development
    // const sampleProduct = sampleBagProducts.find(
    //   product => product.title.toLowerCase() === title.toLowerCase()
    // );

    // if (sampleProduct) {
    //   return NextResponse.json(sampleProduct);
    // }

    // If not found in sample data, try the database
    try {
      await connectToDatabase();

      // Find product by title (case-insensitive)
      const product = await Product.findOne({
        title: { $regex: new RegExp(`^${title}$`, 'i') }
      });

      if (product) {
        return NextResponse.json(product);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue to fallback to sample data or not found response
    }

    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
