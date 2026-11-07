const { z } = require('zod');

const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' }).trim().email('Enter a valid email'),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email('Enter a valid email'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

const courseSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).trim().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  price: z.coerce.number().min(0, 'Price cannot be negative').optional(),
});

module.exports = { registerSchema, loginSchema, courseSchema };