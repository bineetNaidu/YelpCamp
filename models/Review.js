import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    body: String,
    rating: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
