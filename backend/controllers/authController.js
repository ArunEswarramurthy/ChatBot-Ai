const jwt = require('jsonwebtoken');
const { User } = require('../models');
const passport = require('passport');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        isPremium: user.isPremium()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      provider: req.user.provider,
      isPremium: req.user.isPremium(),
      subscriptionEnd: req.user.subscriptionEnd
    }
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = req.user;

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required to change password' });
      }
      
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      user.password = newPassword;
    }

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        isPremium: user.isPremium()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;

    if (user.provider === 'local' && !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting account' });
  }
};

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
  deleteAccount,
  googleAuth,
  googleCallback
};