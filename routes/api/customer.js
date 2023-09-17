const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

jwtSecret = require("../../config/keys").jwtSecret;

// Authorization middleware
const auth = require("../../middleware/auth");

// Customer model
const Customer = require("../../models/Customer");
const Application = require("../../models/Application");
const Listing = require("../../models/Listing");

// Register customer
router.post("/", (req, res) => {
  let {
    name,
    email,
    password,
    phone,
    avatar,
    address,
    location,
    gender,
    bio,
    fcmToken,
  } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ msg: "Enter all credentials" });

  // Validations
  const emailRe = /\S+@\S+\.\S+/;
  email = email.trim();
  if (!emailRe.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }
  phone = phone.trim();
  // if (!phoneRe.test(phone)) {
  // return res.status(400).json({ msg: 'Invalid phone number' });
  // }
  Customer.findOne({ email })
    .then((user) => {
      if (user) return res.status(400).json({ msg: "User already exists" });
      const newUser = new Customer({
        name,
        email,
        password,
        gender,
        phone,
        avatar,
        address,
        bio,
        location,
        fcmToken,
      });

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
                { id: newUser.id, type: "Customer" },
                jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    accessToken: token,
                    user: userToSend,
                    userType: "Customer",
                  });
                }
              );
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ msg: "Internal error" });
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: "Internal error" });
    });
});

// Get all customers
router.get("/", (req, res) => {
  Customer.find({})
    .then((customers) => res.send({ customers }))
    .catch((err) => res.sendStatus(400));
});

// Get a customer
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Customer.findById(id)
    .select("-password")
    .lean()
    .then((user) => res.json({ user }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Get customers by listing
router.get("/bylisting/:listingid", async function (req, res) {
  const listingId = req.params.listingid;
  let applications = await Application.find({ listingId });
  applications = applications.map((application) => application.customerId);
  Customer.find({ _id: { $in: applications } })
    .select("-password")
    .lean()
    .then((users) => res.json({ users }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Get customers accepted by contractor
router.get("/bycontractor/:contractorid", async function (req, res) {
  try {
    const contractorId = req.params.contractorid;
    let listings = await Listing.find({ "contractor.id": contractorId });
    const listingIds = listings.map((listing) => listing.id);
    let applications = await Application.find({
      listingId: { $in: listingIds },
    });
    applications = applications.filter(
      (application) => application.status === "Accepted"
    );
    const acceptedIds = applications.map(
      (application) => application.customerId
    );
    let customers = await Customer.find({ _id: { $in: acceptedIds } });
    customers = customers.map((customer) => {
      let application = applications.find(
        (application) => application.customerId == customer.id
      );
      let listing = listings.find((l) => l.id == application.listingId);
      return {
        id: customer.id,
        name: customer.name,
        title: listing.title,
        joiningDate: application.closeDate,
        rating:
          customer.numRatings === 0
            ? 0
            : customer.ratingSum / customer.numRatings,
      };
    });
    return res.json({ customers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal error" });
  }
});

// Update customer
router.put("/:id", auth("Customer"), (req, res) => {
  const id = req.params.id;
  const { name, email, phone, bio, avatar, address, location } = req.body;

  // TODO Validation

  Customer.findById(id)
    .then((user) => {
      if (name) user.name = name;
      if (email) user.email = email;
      if (gender) user.gender = gender;
      if (phone) user.phone = phone;

      if (bio || bio === "") user.bio = bio;
      if (avatar) user.avatar = avatar;
      if (address) user.address = address;
      if (location) user.location = location;
      if (fcmToken) user.fcmToken = fcmToken;

      user.save().then((updatedUser) => {
        const { password, ...userToSend } = updatedUser.toObject();
        res.json({ user: userToSend });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ msg: "Not found" });
    });
});

module.exports = router;
