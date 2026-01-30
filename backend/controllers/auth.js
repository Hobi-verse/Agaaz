const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env

// POST /api/auth/register - for admin to create users
async function register(req, res) {
  try {
    const { username, password, role, assignedSports } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'sport-admin',
      assignedSports: assignedSports || [],
    });

    return res.status(201).json({ success: true, data: { username: user.username, role: user.role, assignedSports: user.assignedSports } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to register' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role, assignedSports: user.assignedSports }, JWT_SECRET, { expiresIn: '24h' });

    return res.json({ success: true, data: { token, user: { username: user.username, role: user.role, assignedSports: user.assignedSports } } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
}

module.exports = { register, login };