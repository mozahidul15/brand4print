import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productType: string;
  options?: {
    size?: string;
    color?: string;
    shape?: string;
    width?: number;
    height?: number;
    designHash?: string;
    isFirstTimePrinting?: boolean;
  };
  customized?: boolean;
  extraFees?: Array<{ label: string; amount: number }>;
}

export interface IBillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  billingInfo: IBillingInfo;
  shippingInfo: IBillingInfo;
  orderNotes?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  artworkStatus: 'awaiting_review' | 'approved' | 'revision_required' | 'plates_created';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  productType: { type: String, required: true },
  options: {
    size: { type: String },
    color: { type: String },
    shape: { type: String },
    width: { type: Number },
    height: { type: Number },
    designHash: { type: String },
    isFirstTimePrinting: { type: Boolean }
  },
  customized: { type: Boolean, default: false },
  extraFees: [{
    label: { type: String, required: true },
    amount: { type: Number, required: true }
  }]
});

const BillingInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});

const OrderSchema: Schema = new Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  items: [OrderItemSchema],
  billingInfo: { 
    type: BillingInfoSchema, 
    required: true 
  },
  shippingInfo: { 
    type: BillingInfoSchema, 
    required: true 
  },
  orderNotes: { type: String },
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  artworkStatus: {
    type: String,
    enum: ['awaiting_review', 'approved', 'revision_required', 'plates_created'],
    default: 'awaiting_review'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ artworkStatus: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
