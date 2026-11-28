import User, { type UserDocument } from '../models/User';

export interface PublicUserRecord {
  _id: unknown;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthUserRecord extends PublicUserRecord {
  passwordHash: string;
}

export async function findByEmail(email: string): Promise<AuthUserRecord | null> {
  try {
    return await User.findOne({ email }).select('+passwordHash').lean<AuthUserRecord>();
  } catch (error: unknown) {
    throw error;
  }
}

export async function findById(id: string): Promise<PublicUserRecord | null> {
  try {
    return await User.findById(id).lean<PublicUserRecord>();
  } catch (error: unknown) {
    throw error;
  }
}

export async function create(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<UserDocument & { _id: unknown }> {
  try {
    const user = await User.create(input);
    return user.toObject();
  } catch (error: unknown) {
    throw error;
  }
}
