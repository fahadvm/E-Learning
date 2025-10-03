import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  courses: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course', required: true }],
  createdAt: { type: Date, default: Date.now }
});

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
 