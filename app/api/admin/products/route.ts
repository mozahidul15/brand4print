import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import Product from '@/lib/models/product';
import { getCurrentUser } from '@/lib/utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = getCurrentUser(req);
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const productType = searchParams.get('productType') || 'all';    // Build query
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } }
      ];
    }

    if (productType !== 'all') {
      query.productType = productType;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Product.countDocuments(query);

    // Get stats
    const stats = {
      total: await Product.countDocuments(),
      inStock: await Product.countDocuments({ inStock: true }),
      outOfStock: await Product.countDocuments({ inStock: false }),
      customizable: await Product.countDocuments({ customizable: true })
    };

    return NextResponse.json({
      products,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = getCurrentUser(req);
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const productData = await req.json();

    // Validate required fields
    const requiredFields = ['title', 'sku', 'short_description', 'description', 'minPrice', 'mainImage', 'productType'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Set default price if not provided
    if (!productData.price) {
      productData.price = productData.minPrice;
    }

    // Ensure images array includes thumbnails
    if (!productData.images || productData.images.length === 0) {
      productData.images = productData.thumbnails || [];
    }

    // Create product
    const product = new Product(productData);
    await product.save();

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }    );

  } catch (error: unknown) {
    console.error('Error creating product:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = getCurrentUser(req);
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { productId, ...updateData } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // If SKU is being updated, check for duplicates
    if (updateData.sku && updateData.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: updateData.sku });
      if (existingProduct) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Ensure images array includes thumbnails
    if (updateData.thumbnails && (!updateData.images || updateData.images.length === 0)) {
      updateData.images = updateData.thumbnails;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct    });

  } catch (error: unknown) {
    console.error('Error updating product:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

