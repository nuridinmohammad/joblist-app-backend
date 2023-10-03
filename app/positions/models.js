import mongoose from "mongoose";
const { model, Schema } = mongoose;

const positionsSchema = new Schema(
  {
    type: {
      type: Boolean,
      default: false,
    },
    url: String,
    company: {
      type: String,
      required: [true, "Company harus diisi"],
      minlength: [3, "Company Nama minimal harus 3 karakter"],
    },
    company_url: String,
    location: {
      required: [true, "Loation harus diisi"],
      type: String,
      minlength: [3, "Location minimal harus 3 karakter"],
    },
    title: {
      type: String,
      required: [true, "Title harus diisi"],
      minlength: [3, "Title minimal harus 3 karakter"],
    },
    description: {
      type: String,
      minlength: [3, "Panjang nama description minimal 3 karakter "],
    },
    how_to_apply: String,
    company_logo: String,
  },
  { timestamps: true }
);
const Positions = model("Positions", positionsSchema);

export default Positions;
