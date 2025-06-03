/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';

// Customization interface
export interface ICustomization extends Document {
  userId?: string;
  sessionId: string;
  productId: string;
  productTitle: string;
  designHash: string;
  artworkData: {
    originalFileName?: string;
    fileType: string;
    fileSize: number;
    canvasData?: any;
    previewImageUrl: string;
    analysis: {
      colorCount: number;
      complexity: 'simple' | 'complex';
      isVector: boolean;
      needsVectorization: boolean;
      hasGradients: boolean;
      isHighRes: boolean;
    };
  };
  customizationOptions: {
    selectedSize?: string;
    selectedPrintOption?: string;
    selectedColor?: string;
    selectedShape?: string;
  };
  pricing: {
    basePrice: number;
    plateFee: number;
    vectorizationFee: number;
    setupFee: number;
    totalPrice: number;
    isFirstTimePrinting: boolean;
  };
  status: 'draft' | 'validated' | 'ordered' | 'printed';
  printHistory: Array<{
    orderId: string;
    printedAt: Date;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const CustomizationSchema = new Schema<ICustomization>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      ref: 'Product',
    },
    productTitle: {
      type: String,
      required: true,
    },
    designHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    artworkData: {
      originalFileName: String,
      fileType: {
        type: String,
        required: true,
      },
      fileSize: {
        type: Number,
        required: true,
      },
      canvasData: Schema.Types.Mixed,
      previewImageUrl: {
        type: String,
        required: true,
      },
      analysis: {
        colorCount: {
          type: Number,
          required: true,
          min: 1,
        },
        complexity: {
          type: String,
          enum: ['simple', 'complex'],
          required: true,
        },
        isVector: {
          type: Boolean,
          default: false,
        },
        needsVectorization: {
          type: Boolean,
          default: false,
        },
        hasGradients: {
          type: Boolean,
          default: false,
        },
        isHighRes: {
          type: Boolean,
          default: false,
        },
      },
    },
    customizationOptions: {
      selectedSize: String,
      selectedPrintOption: String,
      selectedColor: String,
      selectedShape: String,
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },
      plateFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      vectorizationFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      setupFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      isFirstTimePrinting: {
        type: Boolean,
        default: true,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'validated', 'ordered', 'printed'],
      default: 'draft',
    },
    printHistory: [{
      orderId: {
        type: String,
        required: true,
      },
      printedAt: {
        type: Date,
        default: Date.now,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
CustomizationSchema.index({ userId: 1, createdAt: -1 });
CustomizationSchema.index({ sessionId: 1, createdAt: -1 });
CustomizationSchema.index({ designHash: 1 });
CustomizationSchema.index({ status: 1 });

// Create and export the Customization model
const Customization: Model<ICustomization> = mongoose.models.Customization || mongoose.model<ICustomization>('Customization', CustomizationSchema);

export default Customization;
