const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authorization middleware
const auth = require('../../middleware/auth');

// Listing model
const Listing = require('../../models/Listing');

// Create listing
router.post('/', auth('Contractor'), (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type !== 'Contractor') {
    return res.status(401).json({ msg: 'User is not a contractor' });
  }

  const { title, deadlineDate, duration, payRate, thumbnailImage } = req.body;

  if (!title || deadlineDate === null || !payRate) {
    return res.status(400).json({ msg: 'Enter all fields' });
  }

  // TODO validations
  Contractor.findById(user.id)
    .select('-password')
    .lean()
    .then((user) => {
      if (user) {
        const newListing = new Listing({
          title,
          deadlineDate,
          duration,
          payRate,
          thumbnailImage,
          contractor: {
            id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
          },
        });
        newListing
          .save()
          .then((listing) => res.json({ listing }))
          .catch((err) => res.status(500).json({ msg: err }));
      } else {
        return res.status(400).json({ msg: 'Invalid token' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ msg: 'Invalid token' });
    });
});

// Get all listings
router.get('/', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type === 'Contractor') {
    Listing.find({ 'contractor.id': user.id })
      .populate('category', 'id title')
      .then((listings) => res.json({ data: listings }))
      .catch((err) => res.sendStatus(400));
  } else {
    Listing.find({})
      .populate('category', 'id title')
      .then((listings) => res.json({ data: listings }))
      .catch((err) => res.sendStatus(400));
  }
});
// Get all listings
router.get('/search/:search', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  const searchTerm = req.params.search;

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  const query =
    user.type === 'Contractor'
      ? {
          $or: [
            { 'contractor.id': user.id },
            { 'category.title': { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search for category title
            { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search for listing title
          ],
        }
      : {
          $or: [
            { 'category.title': { $regex: searchTerm, $options: 'i' } },
            { title: { $regex: searchTerm, $options: 'i' } },
          ],
        };
  Listing.find(query)
    .populate('category', 'id title')
    .then((listings) => res.json({ data: listings }))
    .catch((err) => res.sendStatus(400));
});

// Get listing by Id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Listing.findById(id)
    .lean()
    .populate('category', '_id title')
    .then((listing) => res.json({ data: listing }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Get Listing by contractor
router.get('/bycontractor/:contractorid', (req, res) => {
  const contractorId = req.params.contractorid;
  Listing.find({ 'contractor.id': contractorId })
    .lean()
    .then((listings) => res.json({ listings }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Update listing
router.put('/:id', auth('Contractor'), (req, res) => {
  const id = req.params.id;
  const { title, deadlineDate, duration, payRate, thumbnailImage } = req.body;
  const errors = [];
  Listing.findById(id)
    .then((listing) => {
      if (deadlineDate) {
        if (deadlineDate < Date.now())
          errors.push('Deadline date cannot be in the past');
        else {
          listing.deadlineDate = deadlineDate;
          listing.title = title;
          listing.payRate = payRate;
          listing.thumbnailImage = thumbnailImage;
        }
      }
      if (errors.length != 0) return res.status(400).json({ errors });
      else {
        listing
          .save()
          .then((newListing) => res.json({ data: newListing }))
          .catch((err) => res.status(500).json({ msg: 'Internal error' }));
      }
    })
    .catch((err) => {
      return res.status(404).json({ msg: 'Not found' });
    });
});

// Delete listing
router.delete('/:id', auth('Contractor'), async function (req, res) {
  try {
    const id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id, { deleted: true });
    await Application.updateMany(
      { listingId: listing.id },
      { status: 'Deleted', closeDate: Date.now() }
    );
    res.json({ listing });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Internal error' });
  }
});

module.exports = router;
