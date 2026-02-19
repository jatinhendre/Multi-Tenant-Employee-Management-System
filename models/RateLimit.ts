import mongoose, { Schema, models, model } from "mongoose";

const RateLimitSchema = new Schema({
  ipAddress: {
    type: String,
    required: true,
    index: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  windowStart: {
    type: Date,
    required: true,
  },
});

export const RateLimit =
  models.RateLimit || model("RateLimit", RateLimitSchema);