import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { model, Schema } = mongoose;
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Nama harus Diisi"],
      minlength: [3, "Panjang Nama min 3 karakter"],
      maxlength: [255, "Panjang Nama max 255 karakter"],
    },
    username: {
      type: String,
      required: [true, "Username harus Diisi"],
      minlength: [3, "Panjang Username min 3 karakter"],
      maxlength: [255, "Panjang Username max 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password Harus diisi"],
      maxlength: [255, "Panjang password maksimal 255 karakter"],
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path("username").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ username: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

const User = model("User", userSchema);

export default User;
