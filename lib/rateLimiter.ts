import { RateLimit } from "../models/RateLimit";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export async function checkRateLimit(
  ipAddress: string,
  maxRequests = 10,
  windowMs = 60 * 1000 
): Promise<RateLimitResult> {
  const now = new Date();

  const record = await RateLimit.findOne({ ipAddress });

  if (!record) {
    await RateLimit.create({
      ipAddress,
      count: 1,
      windowStart: now,
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
    };
  }

  const windowAge = now.getTime() - record.windowStart.getTime();

  if (windowAge > windowMs) {
    record.count = 1;
    record.windowStart = now;
    await record.save();

    return {
      allowed: true,
      remaining: maxRequests - 1,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  record.count += 1;
  await record.save();

  return {
    allowed: true,
    remaining: maxRequests - record.count,
  };
}
