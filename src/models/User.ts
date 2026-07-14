import bcrypt from "bcryptjs";
import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  photoUrl?: string;
  phone?: string;
  bio?: string;
  address?: string;
  favoriteEvents?: mongoose.Types.ObjectId[];
  role: "attendee" | "organizer" | "admin" | "blocked";
}

interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, UserMethods>;

type UserModel = Model<IUser, Record<string, never>, UserMethods>;

const userSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    photoUrl: { type: String, trim: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    address: { type: String, trim: true },
    favoriteEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    role: {
      type: String,
      enum: ["attendee", "organizer", "admin", "blocked"],
      default: "attendee",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.method(
  "comparePassword",
  async function comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  },
);

const User =
  (mongoose.models.User as UserModel | undefined) ||
  mongoose.model<IUser, UserModel>("User", userSchema);

export default User;

