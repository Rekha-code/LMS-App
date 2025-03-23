import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Store Clerk ID separately
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Emails should be unique
    imageUrl: { type: String, required: true },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
