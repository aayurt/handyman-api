const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

jwtSecret = require('../../config/keys').jwtSecret;

// Models
const Customer = require('../../models/Customer');
const Contractor = require('../../models/Contractor');

const auth = require('../../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.

  const { price } = req.body;

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2022-11-15' }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: 'eur',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUB_KEY,
  });
});
// Customer login
router.post('/customer', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Enter all credentials' });

  // TODO: Add validations

  Customer.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "User doesn't exists" });

      bcrypt.compare(password, user.password).then((match) => {
        if (!match) return res.status(400).json({ msg: 'Wrong password' });
        const { password, ...userToSend } = user.toObject();
        jwt.sign(
          { id: user.id, type: 'Customer' },
          jwtSecret,
          { expiresIn: 10000 },
          (err, token) => {
            if (err) throw err;
            res.json({
              accessToken: token,
              user: userToSend,
              userType: 'Customer',
            });
          }
        );
      });
    })
    .catch((err) => {
      return res.status(500).json({ msg: 'Internal error' });
    });
});

// Contractor login
router.post('/contractor', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: 'Enter all credentials' });

  // TODO: Add validations

  Contractor.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "User doesn't exists" });

      bcrypt.compare(password, user.password).then((match) => {
        if (!match) return res.status(400).json({ msg: 'Wrong password' });
        const { password, ...userToSend } = user.toObject();
        jwt.sign(
          { id: user.id, type: 'Contractor' },
          jwtSecret,
          { expiresIn: 10000 },
          (err, token) => {
            if (err) throw err;
            res.json({
              accessToken: token,
              user: userToSend,
              userType: 'Contractor',
            });
          }
        );
      });
    })
    .catch((err) => {
      return res.status(500).json({ msg: 'Internal error' });
    });
});

// Validate tokens and auth
router.get('/profile', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    // Add user from payload
    const user = decoded;
    //console.log(req.user);
    if (user.type == 'Contractor') {
      Contractor.findById(user.id)
        .select('-password')
        .lean()
        .then((user) => {
          console.log('user', user);
          if (user) {
            res.json({ data: user });
          } else {
            return res.status(400).json({ msg: 'Invalid token' });
          }
        })
        .catch((err) => {
          return res.status(400).json({ msg: 'Invalid token' });
        });
    } else if (user.type == 'Customer') {
      Customer.findById(user.id)
        .select('-password')
        .lean()
        .then((user) => {
          if (user) {
            res.json({ data: user });
          } else {
            return res.status(400).json({ msg: 'Invalid token' });
          }
        })
        .catch((err) => {
          return res.status(400).json({ msg: 'Invalid token' });
        });
    } else {
      return res.status(400).json({ msg: 'Invalid token' });
    }
  } catch (e) {
    return res.status(400).json({ msg: 'Invalid token' });
  }
});

// Validate tokens and auth
router.patch('/profile', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    // Add user from payload
    const user = decoded;
    //console.log(req.user);
    const id = user.id;

    if (user.type == 'Contractor') {
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
        linkedIn,
        github,
        website,
        avatar,
        address,
        location,
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
          if (linkedIn) user.linkedIn = linkedIn;
          if (github) user.github = github;
          if (website) user.website = website;

          user.save().then((updatedUser) => {
            //const {password, ...userToSend} = updatedUser.toObject();
            if (updateListings) {
              Listing.updateMany(
                { 'contractor.id': updatedUser.id },
                {
                  'contractor.name': updatedUser.name,
                  'contractor.email': updatedUser.email,
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
    } else if (user.type == 'Customer') {
      const { name, email, phone, bio, avatar, address, location, gender } =
        req.body;

      // TODO Validation

      Customer.findById(id)
        .then((user) => {
          if (name) user.name = name;
          if (email) user.email = email;
          if (gender) user.gender = gender;
          if (phone) user.phone = phone;

          if (bio || bio === '') user.bio = bio;
          if (avatar) user.avatar = avatar;
          if (address) user.address = address;
          if (location) user.location = location;
          user.save().then((updatedUser) => {
            const { password, ...userToSend } = updatedUser.toObject();
            res.json({ user: userToSend });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(404).json({ msg: 'Not found' });
        });
    } else {
      return res.status(400).json({ msg: 'Invalid token' });
    }
  } catch (e) {
    return res.status(400).json({ msg: 'Invalid token' });
  }
});

router.get('/contractor/:id', auth('Contractor'), (req, res) => {
  const id = req.params.id;
  if (id == req.user.id) {
    return res.json({ loggedIn: true });
  }
  res.sendStatus(401);
});

router.get('/customer/:id', auth('Customer'), (req, res) => {
  const id = req.params.id;
  if (id == req.user.id) {
    return res.json({ loggedIn: true });
  }
  res.sendStatus(401);
});

module.exports = router;
