const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
exports.register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, phone, email, password });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get user score
exports.getScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Submit exam and update score
exports.submitExam = async (req, res) => {
  const { score } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.hasGivenExam) return res.status(400).json({ message: 'You can only take the exam once' });

    user.score = score;
    user.hasGivenExam = true;
    await user.save();

    res.json({ message: 'Exam submitted successfully', score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};