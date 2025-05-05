// models/Group.js
import { Schema, model } from "mongoose";

const CalendarEventSchema = new Schema({
  id: {
    type: String,
    required: true, // this is your manually generated timestamp-based id
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['QUIZ', 'MEETING', 'DEADLINE', 'OTHER'],
    required: true,
  },
  description: {
    type: String,
    default: "",
  }
}, { _id: false });

const GroupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
    unique: true // prevent duplicate group names
  },
  groupDescription: {
    type: String,
    default: ""
  },
  groupMembers: {
    type: [String], // array of userIds
    required: true
  },
  calendar: {
    type: [CalendarEventSchema],
    default: []
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model("CalenderGroup", GroupSchema);
