const express = require('express');
const router = express.Router();

// Authorization middleware
const auth = require('../../middleware/auth');

// models
const JobRating = require('../../models/JobRating');
const CustomerRating = require('../../models/CustomerRating');
const Customer = require('../../models/Customer');
const Listing = require('../../models/Listing');

// Rate customer
router.post('/customer', auth('Contractor'), async function (req, res) {
  const { value, contractorId, customerId } = req.body;
  if (!value || !contractorId || !customerId) return res.sendStatus(400);
  if (value < 0 || value > 5)
    return res.status(400).json({ msg: 'Rating must be between 0 and 5' });

  let rating = await CustomerRating.findOne({ customerId, contractorId });
  if (!rating) {
    rating = new CustomerRating({ contractorId, customerId, value });
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { numRatings: 1, ratingSum: value },
    });
    rating = await rating.save();
    return res.json({ rating });
  }
  await Customer.findByIdAndUpdate(customerId, {
    $inc: { ratingSum: value - rating.value },
  });
  rating.value = value;
  rating = await rating.save();
  return res.json({ rating });
});

// Rate job
router.post('/listing', auth('Customer'), async function (req, res) {
  const { value, listingId, customerId } = req.body;
  if (!value || !listingId || !customerId) return res.sendStatus(400);
  if (value < 0 || value > 5)
    return res.status(400).json({ msg: 'Rating must be between 0 and 5' });

  let rating = await JobRating.findOne({ customerId, listingId });
  if (!rating) {
    rating = new JobRating({ listingId, customerId, value });
    await Listing.findByIdAndUpdate(listingId, {
      $inc: { numRatings: 1, ratingSum: value },
    });
  }
  rating.value = value;
  rating = await rating.save();
  res.json({ rating });
});

// Find job ratings by customer
router.get('/listing/bycustomer/:customerid', async function (req, res) {
  const customerId = req.params.customerid;
  const ratings = await JobRating.find({ customerId });
  res.json({ ratings });
});

// Find customer ratings by contractor
router.get('/customer/bycontractor/:contractorid', async function (req, res) {
  const contractorId = req.params.contractorid;
  const ratings = await CustomerRating.find({ contractorId });
  res.json({ ratings });
});

// Find job rating
router.get('/listing/:listingid/:customerid', async function (req, res) {
  const customerId = req.params.customerid;
  const listingId = req.params.customerid;
  let rating = await JobRating.findOne({ customerId, listingId });
  res.json({ rating });
});

// Find customer rating
router.get('/customer/:customerid/:contractorid', async function (req, res) {
  const customerId = req.params.customerid;
  const contractorId = req.params.contractorid;
  let rating = await CustomerRating.findOne({ customerId, contractorId });
  res.json({ rating });
});

module.exports = router;
