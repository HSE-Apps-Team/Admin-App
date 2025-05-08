import { serialize } from 'cookie';

export default function handler(req, res) {
  // Only allow POST method for login
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get credentials from request body
  const { password } = req.body;
  
  // Use environment variable for password with no fallback
  // This forces you to set up a secure password in your environment variables
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
  // Ensure password is configured
  if (!ADMIN_PASSWORD) {
    console.error('Admin password not configured in environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }
  
  // Check if password matches
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // If authentication is successful, set a cookie with the token
  const token = generateToken(); // You may want to use a JWT library here
  
  // Set cookie
  res.setHeader('Set-Cookie', serialize('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'strict',
    path: '/',
  }));

  // Return success with valid flag for client-side state management
  return res.status(200).json({ 
    success: true, 
    valid: true,
    message: 'Authentication successful'
  });
}

// Simple function to generate a token - consider using JWT for better security
function generateToken() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
