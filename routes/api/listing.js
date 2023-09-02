const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authorization middleware
const auth = require('../../middleware/auth');

// Listing model
const Listing = require('../../models/Listing');
const Application = require('../../models/Application');
const JobRating = require('../../models/JobRating');

// Create listing
router.post('/', auth('Contractor'), (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type !== 'Contractor') {
    return res.status(401).json({ msg: 'User is not a contractor' });
  }

  const {
    title,
    deadlineDate,
    duration,
    payRate,
    thumbnailImage,
    description,
    category,
  } = req.body;

  if (!title || deadlineDate === null || !payRate) {
    return res.status(400).json({ msg: 'Enter all fields' });
  }

  // TODO validations
  const newListing = new Listing({
    title,
    deadlineDate,
    duration,
    payRate,
    description,
    thumbnailImage,
    contractor: user.id,
    category,
  });
  newListing
    .save()
    .then((listing) => res.json({ listing }))
    .catch((err) => res.status(500).json({ msg: err }));
  // Contractor.findById(user.id)
  //   .select('-password')
  //   .lean()
  //   .then((user) => {
  //     if (user) {
  //       const newListing = new Listing({
  //         title,
  //         deadlineDate,
  //         duration,
  //         payRate,
  //         description,
  //         thumbnailImage,
  //         contractor: {
  //           _id: user._id,
  //           name: user.name,
  //           email: user.email,
  //           location: user.location,
  //         },
  //       });
  //       newListing
  //         .save()
  //         .then((listing) => res.json({ listing }))
  //         .catch((err) => res.status(500).json({ msg: err }));
  //     } else {
  //       return res.status(400).json({ msg: 'Invalid token' });
  //     }
  //   })
  //   .catch((err) => {
  //     return res.status(400).json({ msg: 'Invalid token' });
  //   });
});

// Get all listings
router.get('/', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type === 'Contractor') {
    Listing.find({ contractor: user.id })
      .populate('category', 'id title')
      .populate('contractor')
      .then((listings) => res.json({ data: listings }))
      .catch((err) => res.sendStatus(400));
  } else {
    Listing.find({})
      .populate('category', 'id title')
      .populate('contractor')

      .then(async (listings) => {
        const fetchRatingsPromises = listings.map(async (listing) => {
          try {
            const ratings = await JobRating.find({
              listingId: listing.id,
            });

            return {
              ...listing.toObject(),
              ratings,
            };
          } catch (error) {
            console.log('Error fetching ratings:', error);
            throw error; // Rethrow the error to be caught later
          }
        });

        try {
          const newListings = await Promise.all(fetchRatingsPromises);

          for (let index = 0; index < newListings.length; index++) {
            const listing = newListings[index];
            const ratings = listing.ratings;

            if (ratings.length > 0) {
              let totalRating = 0;

              for (
                let ratingIndex = 0;
                ratingIndex < ratings.length;
                ratingIndex++
              ) {
                const ratingValue = ratings[ratingIndex].value;
                totalRating += ratingValue;
              }

              const averageRating = totalRating / ratings.length;
              listing.rating = averageRating;
            } else {
              listing.rating = 0; // No ratings, set default rating
            }

            delete listing.ratings; // Remove the ratings array from the listing
          }

          res.json({ data: newListings });
        } catch (error) {
          console.log('Error fetching ratings for some listings:', error);
          res.sendStatus(500);
        }
      })
      .catch((err) => {
        console.log('Error fetching listings:', err);
        res.sendStatus(400);
      });
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
            { contractor: user.id },
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
    .populate('contractor')

    .then((listing) => {
      console.log('===', listing);

      return res.json({ data: listing });
    })
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Get Listing by contractor
router.get('/bycontractor/:contractorid', (req, res) => {
  const contractorId = req.params.contractorid;
  Listing.find({ contractor: contractorId })
    .lean()
    .then((listings) => res.json({ listings }))
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Update listing
router.put('/:id', auth('Contractor'), (req, res) => {
  const id = req.params.id;
  const { title, deadlineDate, description, payRate, thumbnailImage } =
    req.body;
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
          listing.description = description;
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
