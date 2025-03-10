import mongoose, { Schema } from "mongoose";
import Perfume from "./perfume.model.js";

const brandSchema = new Schema(
  { brandName: { type: String, unique: true, required: true } },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Add method to check if brand is used by any perfumes
brandSchema.statics.isUsedByPerfumes = async function (brandId) {
  const count = await Perfume.countDocuments({ brand: brandId });
  return count > 0;
};

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
