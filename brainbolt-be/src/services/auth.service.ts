import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { signToken } from '../lib/jwt';
import { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../schemas/auth.schema';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new AppError(400, 'Email already registered');
      }
      throw new AppError(400, 'Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with related records in a transaction
    const user = await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
        },
      });

      // Create user state
      await tx.userState.create({
        data: {
          userId: newUser.id,
        },
      });

      // Create leaderboard entries
      await tx.leaderboardScore.create({
        data: {
          userId: newUser.id,
          username: newUser.username,
          totalScore: 0,
        },
      });

      await tx.leaderboardStreak.create({
        data: {
          userId: newUser.id,
          username: newUser.username,
          maxStreak: 0,
        },
      });

      return newUser;
    });

    // Generate token
    const token = signToken(user.id);

    return {
      access_token: token,
      token_type: 'bearer',
      user: this.formatUser(user),
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const token = signToken(user.id);

    return {
      access_token: token,
      token_type: 'bearer',
      user: this.formatUser(user),
    };
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return this.formatUser(user);
  }

  private formatUser(user: { id: string; username: string; email: string; createdAt: Date }): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.createdAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
