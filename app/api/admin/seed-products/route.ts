import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import Product from '@/lib/models/product';
import { getCurrentUser } from '@/lib/utils/auth';

// Sample product data for seeding
const sampleProducts = [
  {
    title: 'Vinyl Sticker - Circle',
    sku: 'VS-CIRCLE-001',
    description: 'High-quality vinyl stickers that are durable and waterproof. Perfect for indoor and outdoor use.',
    price: 15.99,
    minPrice: 15.99,
    maxPrice: 29.99,
    mainImage: 'https://i.ibb.co/ZzTxM0L4/pd-1.jpg',
    thumbnails: ['https://i.ibb.co/fdd7m9xB/pd-1-1.jpg', 'https://i.ibb.co/ZpPnR4xf/pd-1-2.jpg'],
    productType: 'vinyl-sticker',
    customizable: true,
    inStock: true,
    options: {
      shapes: [
        { id: 'circle', label: 'Circle' },
        { id: 'square', label: 'Square' },
        { id: 'rectangle', label: 'Rectangle' },
        { id: 'custom', label: 'Custom' }
      ],
      sizes: [
        { width: 50, height: 50, label: 'Small (50mm x 50mm)' },
        { width: 100, height: 100, label: 'Medium (100mm x 100mm)' },
        { width: 150, height: 150, label: 'Large (150mm x 150mm)' }
      ]
    }
  },
  {
    title: 'Paper Sticker - Die Cut',
    sku: 'PS-DIECUT-001',
    description: 'Premium paper stickers with a die-cut finish. Ideal for product labels, packaging, and promotional materials.',
    price: 12.99,
    minPrice: 12.99,
    maxPrice: 24.99,
    mainImage: 'https://i.ibb.co/qYLkZ19T/pd-2.jpg',
    thumbnails: ['https://i.ibb.co/RTx3ScCq/pd-2-1.jpg', 'https://i.ibb.co/21Nq3wDG/pd-2-2.jpg', 'https://i.ibb.co/GQWthwbL/pd-2-3.jpg', 'https://i.ibb.co/m5KNMj7T/pd-2-4.jpg', 'https://i.ibb.co/TD508Cxn/pd-2-5.jpg', 'https://i.ibb.co/pjC95hDV/pd-2-6.jpg'],
    productType: 'paper-sticker',
    customizable: true,
    inStock: true,
    options: {
      shapes: [
        { id: 'circle', label: 'Circle' },
        { id: 'square', label: 'Square' },
        { id: 'rectangle', label: 'Rectangle' },
        { id: 'custom', label: 'Custom' }
      ],
      sizes: [
        { width: 40, height: 40, label: 'Small (40mm x 40mm)' },
        { width: 80, height: 80, label: 'Medium (80mm x 80mm)' },
        { width: 120, height: 120, label: 'Large (120mm x 120mm)' }
      ]
    }
  },
  {
    title: 'White Paper Bag - Premium',
    sku: 'WPB-PREM-001',
    description: 'Premium white paper bags with custom printing. Perfect for retail, gifts, and promotional events.',
    price: 19.99,
    minPrice: 19.99,
    maxPrice: 39.99,
    mainImage: 'https://i.ibb.co/4zFhhVy/pd-3.jpg',
    thumbnails: ['https://i.ibb.co/Zzr0NtSW/pd-3-1.jpg', 'https://i.ibb.co/209psS7m/pd-3-2.jpg', 'https://i.ibb.co/Cp0QgPVC/pd-3-3.jpg', 'https://i.ibb.co/6RmSFCKF/pd-3-4.jpg'],
    productType: 'white-paper-bag',
    customizable: true,
    inStock: true,
    options: {
      bagSizes: [
        { id: 'small', label: 'Small (20cm x 30cm x 10cm)' },
        { id: 'medium', label: 'Medium (30cm x 40cm x 12cm)' },
        { id: 'large', label: 'Large (40cm x 50cm x 15cm)' }
      ],
      printColors: [
        { id: 'one-color-one-side', label: '1 Color, 1 Side' },
        { id: 'one-color-two-sides', label: '1 Color, 2 Sides' },
        { id: 'two-color-one-side', label: '2 Colors, 1 Side' },
        { id: 'two-color-two-sides', label: '2 Colors, 2 Sides' },
        { id: 'full-color-one-side', label: 'Full Color, 1 Side' },
        { id: 'full-color-two-sides', label: 'Full Color, 2 Sides' }
      ]
    }
  },
  {
    title: 'Brown Paper Bag - Eco',
    sku: 'BPB-ECO-001',
    description: 'Eco-friendly brown paper bags with custom printing. Sustainable packaging solution for environmentally conscious businesses.',
    price: 17.99,
    minPrice: 17.99,
    maxPrice: 35.99,
    mainImage: 'https://i.ibb.co/NghcJDKn/pd-4.jpg',
    thumbnails: ['https://i.ibb.co/sv02DWSY/pd-4-1.jpg', 'https://i.ibb.co/xwCTHjg/pd-4-2.jpg', 'https://i.ibb.co/jkW6Yd3Z/pd-4-3.jpg', 'https://i.ibb.co/JwL3yM1D/pd-4-4.jpg'],
    productType: 'brown-paper-bag',
    customizable: true,
    inStock: true,
    options: {
      bagSizes: [
        { id: 'small', label: 'Small (20cm x 30cm x 10cm)' },
        { id: 'medium', label: 'Medium (30cm x 40cm x 12cm)' },
        { id: 'large', label: 'Large (40cm x 50cm x 15cm)' }
      ],
      printColors: [
        { id: 'one-color-one-side', label: '1 Color, 1 Side' },
        { id: 'one-color-two-sides', label: '1 Color, 2 Sides' },
        { id: 'two-color-one-side', label: '2 Colors, 1 Side' },
        { id: 'two-color-two-sides', label: '2 Colors, 2 Sides' },
        { id: 'full-color-one-side', label: 'Full Color, 1 Side' },
        { id: 'full-color-two-sides', label: 'Full Color, 2 Sides' }
      ]
    }
  }
];

/**
 * POST /api/admin/seed-products
 * Seeds sample product data for testing
 */
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = getCurrentUser(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Clear existing products if requested
    const { clearExisting } = await req.json();
    if (clearExisting) {
      await Product.deleteMany({});
    }

    // Add images array from mainImage and thumbnails
    const productsWithImages = sampleProducts.map(product => ({
      ...product,
      images: [product.mainImage, ...product.thumbnails]
    }));

    // Insert sample products
    const result = await Product.insertMany(productsWithImages);

    return NextResponse.json(
      { 
        success: true, 
        message: `${result.length} products seeded successfully` 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { error: 'Failed to seed products' },
      { status: 500 }
    );
  }
}
