import mongoose from 'mongoose';
import Review from './Review.js';
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    _id: false,
    url: String,
    filename: String,
  },
  { toJSON: { virtuals: true } }
);

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_100');
});

const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
); // ? OPTIONS

CampgroundSchema.virtual('properties.popUp').get(function () {
  return `<a href="/campgrounds/${this._id}" >${this.title}</a>
  <br />
  <img src="${this.images[0]?.thumbnail}" />
  `;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

export default mongoose.model('Campground', CampgroundSchema);
