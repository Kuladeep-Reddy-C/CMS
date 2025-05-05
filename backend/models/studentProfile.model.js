import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // assuming Clerk users won't share IDs
    },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // assuming Clerk users won't share emails
  },
  phone: {
    type: String,
    default: '',
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String, // optional URL to Clerk image or custom upload
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    }
  ]
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
