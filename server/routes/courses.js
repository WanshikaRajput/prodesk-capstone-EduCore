const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/Course');

const router = express.Router();

// Sirf login user ke apne courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ authorId: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Naya course banao (authorId token se aata hai)
router.post('/', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const course = await Course.create({
      title,
      description,
      price,
      authorId: req.user.id,
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Helper: course dhundo aur ownership check karo
async function getOwnedCourse(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid course id' });
    return null;
  }
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404).json({ message: 'Course not found' });
    return null;
  }
  if (course.authorId.toString() !== req.user.id) {
    res.status(403).json({ message: 'Forbidden: you do not own this course' });
    return null;
  }
  return course;
}

router.get('/:id', async (req, res) => {
  try {
    const course = await getOwnedCourse(req, res);
    if (course) res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const course = await getOwnedCourse(req, res);
    if (!course) return;

    const { title, description, price } = req.body;
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (price !== undefined) course.price = price;

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const course = await getOwnedCourse(req, res);
    if (!course) return;

    await course.deleteOne();
    res.json({ message: 'Course deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;