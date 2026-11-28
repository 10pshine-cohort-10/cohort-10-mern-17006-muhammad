import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import logger from '../config/logger';
import AppError from '../utils/AppError';
import * as userRepository from '../repositories/userRepository';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const JWT_SECRET_PLACEHOLDER = 'replace-with-random-secret';

interface UserWithId {
  _id: unknown;
  name: string;
  email: string;
  createdAt: Date;
}

function toPublicUser(user: UserWithId): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  if (secret.trim().toLowerCase() === JWT_SECRET_PLACEHOLDER) {
    throw new Error('JWT_SECRET must not use the example placeholder');
  }
  return secret;
}

function getJwtExpiresIn(): SignOptions['expiresIn'] {
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return expiresIn as SignOptions['expiresIn'];
}

export function validateJwtConfig(): void {
  const secret = getJwtSecret();
  try {
    jwt.sign({ sub: 'startup-validation' }, secret, {
      expiresIn: getJwtExpiresIn(),
    });
  } catch {
    throw new Error('JWT_EXPIRES_IN is invalid');
  }
}

function signToken(user: UserWithId): string {
  return jwt.sign({ sub: String(user._id) }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });
}

export async function register(input: RegisterInput): Promise<void> {
  try {
    const passwordHash = await bcrypt.hash(input.password, 10);

    let user: UserWithId;
    try {
      user = await userRepository.create({
        name: input.name,
        email: input.email,
        passwordHash,
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        return;
      }
      throw error;
    }

    logger.info({ userId: String(user._id) }, 'User registered');
  } catch (error: unknown) {
    throw error;
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  try {
    const user = await userRepository.findByEmail(input.email);
    const valid = Boolean(
      user && (await bcrypt.compare(input.password, user.passwordHash)),
    );

    if (!valid) {
      logger.warn({ email: input.email }, 'Failed login attempt');
      throw new AppError('Invalid email or password', 401);
    }

    logger.info({ userId: String(user!._id) }, 'User logged in');
    return { user: toPublicUser(user!), token: signToken(user!) };
  } catch (error: unknown) {
    throw error;
  }
}

export async function getProfile(userId: string): Promise<PublicUser> {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return toPublicUser(user);
  } catch (error: unknown) {
    throw error;
  }
}
