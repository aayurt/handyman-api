const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

jwtSecret = require('../../config/keys').jwtSecret;
// Authorization middleware
const auth = require('../../middleware/auth');
// Customer model
const Customer = require('../../models/Customer');
const Category = require('../../models/Category');

// Register customer
router.post('/', (req, res) => {
  let { title, description, image, status } = req.body;

  if (!title) return res.status(400).json({ msg: 'Enter all credentials' });

  const newCategory = new Category({
    title,
    description,
    status,
    image,
  });
  newCategory
    .save()
    .then((category) => res.json({ data: category }))
    .catch((err) => res.status(500).json({ msg: err }));
});

// Get all categories
router.get('/', (req, res) => {
  Category.find({})
    .then((categories) => res.send({ data: categories }))
    .catch((err) => res.sendStatus(400));
});

// Get a customer
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Category.findById(id)
    .lean()
    .populate('listings')
    .then((category) => res.json({ data: category }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Update customer
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, image, status } = req.body;

  // TODO Validation

  Category.findById(id)
    .then((category) => {
      if (title) category.title = title;
      if (description) category.description = description;
      if (image) category.image = image;
      if (status) category.status = status;

      category.save().then((updatedCategory) => {
        res.json({ data: updatedCategory });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ msg: 'Not found' });
    });
});

module.exports = router;
