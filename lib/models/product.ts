import mongoose, { Schema, Document, Model } from 'mongoose';

// Product interface
export interface IProduct extends Document {
  title: string;
  sku: string;
  short_description: string;
  description: string;
  price: number;
  minPrice: number;
  maxPrice?: number;
  images: string[];
  mainImage: string;
  thumbnails: string[];
  productType: string;
  customizable: boolean;
  inStock: boolean;
  options?: {
    shapes?: Array<{ id: string; label: string }>;
    bagSizes?: Array<{ id: string; label: string }>;
    printColors?: Array<{ id: string; label: string }>;
    quantity?: number[];
  };
  mockupImages?: {
    front: string;
    back: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    sku: {
      type: String,
      required: [true, 'Please provide a SKU'],
      unique: true,
      trim: true,
    }, short_description: {
      type: String,
      required: [true, 'Please provide a short product description'],
      maxlength: [200, 'Short description cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    minPrice: {
      type: Number,
      required: [true, 'Please provide a minimum product price'],
      min: [0, 'Price cannot be negative'],
    },
    maxPrice: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    images: [{
      type: String,
    }],
    mainImage: {
      type: String,
      required: [true, 'Please provide a main product image'],
    },
    thumbnails: [{
      type: String,
    }], productType: {
      type: String,
      required: [true, 'Please provide a product type'],
      enum: ['sticker', 'bag', 'vinyl-sticker', 'paper-sticker', 'white-paper-bag', 'brown-paper-bag'],
    },
    customizable: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    options: {
      shapes: [{
        id: String,
        label: String,
      }],
      bagSizes: [{
        id: String,
        label: String,
      }],
      printColors: [{
        id: String,
        label: String,
      }],
      quantity: {
        type: [Number],
      }
    },
    mockupImages: {
      front: String,
      back: String,
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Product model
// Check if the model already exists to prevent OverwriteModelError during hot reloading
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
