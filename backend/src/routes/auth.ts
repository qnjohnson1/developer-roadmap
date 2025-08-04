import { Router } from 'express';
import { prisma } from '../index';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { RegisterRequest, LoginRequest } from '../shared/types';

const router = Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  console.log('Login attempt received:', { email: req.body.email });
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    console.log('Password hash from DB:', user.password);
    console.log('Password hash length:', user.password.length);
    const isValidPassword = await comparePassword(password, user.password);
    console.log('Password comparison result:', isValidPassword);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      user: userWithoutPassword,
      token
    });
    console.log('Login successful for:', email);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

// Temporary endpoint to generate password hash (REMOVE IN PRODUCTION)
router.get('/hash-password/:password', async (req, res) => {
  const password = req.params.password;
  const hash = await hashPassword(password);
  return res.json({ 
    password, 
    hash,
    info: 'Use this hash in your database'
  });
});

export default router;