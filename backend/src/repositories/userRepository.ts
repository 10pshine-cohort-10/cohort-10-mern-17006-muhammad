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
  return User.findOne({ email }).select('+passwordHash').lean<AuthUserRecord>();
}

export async function findById(id: string): Promise<PublicUserRecord | null> {
  return User.findById(id).lean<PublicUserRecord>();
}

export async function create(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<UserDocument & { _id: unknown }> {
  const user = await User.create(input);
  return user.toObject();
}
