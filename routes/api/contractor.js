const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

jwtSecret = require('../../config/keys').jwtSecret;

// Authorization middleware
const auth = require('../../middleware/auth');

// Contractor model
const Contractor = require('../../models/Contractor');

// Listing model
const Listing = require('../../models/Listing');

// Register Contractor
router.post('/', (req, res) => {
  let {
    name,
    email,
    password,
    phone,
    avatar,
    address,
    location,
    gender,
    fcmToken,
  } = req.body;

  if (!name || !email || !password || !phone || !address)
    return res.status(400).json({ msg: 'Enter all credentials' });

  // Validations
  const emailRe = /\S+@\S+\.\S+/;
  email = email.trim();
  if (!emailRe.test(email)) {
    return res.status(400).json({ msg: 'Invalid email' });
  }

  phone = phone.trim();
  const phoneRe = /^[0-9]{4}$/;
  if (!phoneRe.test(phone)) {
    return res.status(400).json({ msg: 'Invalid phone number' });
  }

  Contractor.findOne({ email })
    .then((user) => {
      if (user) return res.status(400).json({ msg: 'User already exists' });
      const newUser = new Contractor({
        name,
        email,
        gender,
        password,
        phone,
        avatar,
        address,
        location,
        fcmToken,
      });
      newUser.bio = '';
      newUser.skills = [];
      newUser.education = [];
      newUser.interests = [];
      newUser.experiences = [];

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const { password, ...userToSend } = user.toObject();
              jwt.sign(
                { id: newUser.id, type: 'Contractor' },
                jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    accessToken: token,
                    user: userToSend,
                    userType: 'Contractor',
                  });
                }
              );
            })
            .catch((err) => {
              return res.status(500).json({ msg: 'Internal error' });
            });
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({ msg: 'Internal error' });
    });
});

// Get a contractor
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Contractor.findById(id)
    .select('-password')
    .lean()
    .then((user) => res.json({ user }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Update contractor
router.put('/:id', auth('Contractor'), (req, res) => {
  const id = req.params.id;
  const {
    name,
    email,
    phone,
    gender,
    bio,
    skills,
    education,
    interests,
    experiences,

    avatar,
    address,
    location,
    fcmToken,
  } = req.body;
  Contractor.findById(id)
    .then((user) => {
      const updateListings = user.name !== name || user.email !== email;

      if (name) user.name = name;
      if (email) user.email = email;
      if (gender) user.gender = gender;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;
      if (address) user.address = address;
      if (location) user.location = location;
      if (bio || bio === '') user.bio = bio;
      if (skills) user.skills = skills;
      if (education) user.education = education;
      if (interests) user.interests = interests;
      if (experiences) user.experiences = experiences;
      if (fcmToken) user.fcmToken = fcmToken;

      user.save().then((updatedUser) => {
        //const {password, ...userToSend} = updatedUser.toObject();
        if (updateListings) {
          Listing.updateMany(
            { 'contractor.id': updatedUser.id },
            {
              'contractor.name': updatedUser.name,
              'contractor.email': updatedUser.email,
              'contractor.location': updatedUser.location,
            }
          ).then(() => {
            const { password, ...userToSend } = updatedUser.toObject();
            return res.json({ user: userToSend });
          });
        } else {
          const { password, ...userToSend } = updatedUser.toObject();
          res.json({ user: userToSend });
        }
      });
    })
    .catch((err) => {
      return res.status(404).json({ msg: 'Not found' });
    });
});

module.exports = router;
