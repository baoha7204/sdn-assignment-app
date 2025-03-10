import mongoose, { Schema } from "mongoose";
import { PasswordBcrypt } from "@bhtickix/common";

const memberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    YOB: { type: Number, required: true },
    gender: { type: Boolean, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

memberSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await PasswordBcrypt.hashPassword(this.password);
    this.set("password", hashedPassword);
  }

  done();
});

memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await PasswordBcrypt.comparePassword(enteredPassword, this.password);
};

const Member = mongoose.model("Member", memberSchema);

export default Member;
