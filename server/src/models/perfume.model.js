import mongoose, { Schema } from "mongoose";
import { commentSchema } from "./comment.model.js";

export const TargetAudience = {
  MALE: "male",
  FEMALE: "female",
  UNISEX: "unisex",
};

export const PerfumeConcentration = {
  EXTRACT_DE_PARFUM: "extrait de Parfum (20-30%)",
  EAU_DE_PARFUM: "eau de Parfum (15-20%)",
  EAU_DE_TOILETTE: "eau de Toilette (5-15%)",
  EAU_DE_COLOGNE: "eau de Cologne (2-5%)",
  EAU_FRAICHE: "eau Fraiche (1-3%)",
};

const perfumechema = new Schema(
  {
    perfumeName: { type: String, required: true },
    uri: { type: String, required: true },
    price: { type: Number, required: true },
    concentration: {
      type: String,
      required: true,
      enum: Object.values(PerfumeConcentration),
    },
    description: String,
    ingredients: String,
    volume: { type: Number, required: true },
    targetAudience: {
      type: String,
      required: true,
      enum: Object.values(TargetAudience),
    },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    isActive: { type: Boolean, required: true },
  },
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

const Perfume = mongoose.model("Perfume", perfumechema);

export default Perfume;
