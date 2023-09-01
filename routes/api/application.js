const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const moment = require('moment');

// Authorization middleware
const auth = require('../../middleware/auth');

// models
const Application = require('../../models/Application');
const Listing = require('../../models/Listing');
const Category = require('../../models/Category');

// Create Application
router.post('/', async function (req, res) {
  const { listingId, selectedTimeSlots, description } = req.body;
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type === 'Contractor') {
    return res.sendStatus(400);
  }
  const customerId = user.id;
  const listing = await Listing.findById(listingId);
  if (!listing) return res.sendStatus(400);

  const customerApplications = await Application.find({ customer: customerId });
  let numActive = 0;
  for (let application of customerApplications) {
    if (application.status === 'Accepted')
      return res
        .status(400)
        .json({ msg: "Can't apply when already accepted into a job" });
    if (application.status !== 'Deleted' || application.status !== 'Rejected')
      numActive += 1;
  }
  // if (numActive >= 10)
  //   return res.status(400).json({ msg: "Can't apply to more than 10 jobs" });

  if (listing.deadlineDate < Date.now())
    return res.status(400).json({ msg: 'Deadline passed' });

  const application = await Application.findOne({
    listing: listingId,
    customer: customerId,
  });

  if (
    application &&
    (application.status === 'accepted' || application.status === 'pending')
  )
    return res.status(400).json({ msg: 'Already applied' });

  const formattedTimeSlotData = {};

  Object.keys(selectedTimeSlots).forEach((dateString) => {
    formattedTimeSlotData[moment(dateString).format('L')] =
      selectedTimeSlots[dateString];
  });

  const newApplication = new Application({
    listing: listingId,
    customer: customerId,
    selectedTimeSlots: formattedTimeSlotData,
    description,
  });
  newApplication
    .save()
    .then((application) => {
      Listing.findByIdAndUpdate(listingId, { $inc: { numApps: 1 } })
        .then(() => res.json({ application }))
        .catch((err) => res.status(500).json({ msg: 'Internal error' }));
    })
    .catch((err) => {
      return res.status(500).json({ msg: 'Internal error' });
    });
});

// Get applications by customer
router.get('/bycustomer', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type === 'Contractor') {
    return res.sendStatus(400);
  }
  const customerId = user.id;
  Application.find({ customer: customerId })
    .lean()
    .populate({
      path: 'customer',
    })

    .populate({
      path: 'listing',
      populate: {
        path: 'contractor',
      },
    })
    .then(async (applications) => {
      const newApplicationPromises = applications.map(async (element) => {
        const application = { ...element };

        const categoryId = application['listing']['category'] || '';
        if (categoryId) {
          const category = await Category.findById(categoryId);
          application['listing']['category'] = category;
          return application;
        }
        return application;
      });
      const newApplications = await Promise.all(newApplicationPromises);
      return res.json({ data: newApplications });
    })
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Get applications by listing
router.get('/bylisting/:listingid', (req, res) => {
  const listingId = req.params.listingid;
  Application.find({ listing: listingId })
    .populate({
      path: 'customer',
    })
    .populate({
      path: 'listing',
      populate: {
        path: 'contractor',
      },
    })
    .lean()
    .then(async (applications) => {
      const newApplicationPromises = applications.map(async (element) => {
        const application = { ...element };

        const categoryId = application['listing']['category'] || '';
        if (categoryId) {
          const category = await Category.findById(categoryId);
          application['listing']['category'] = category;
          return application;
        }
        return application;
      });
      const newApplications = await Promise.all(newApplicationPromises);
      return res.json({ data: newApplications });
    })
    .catch((err) => {
      return res.sendStatus(400);
    });
});
router.get('/app/:id', (req, res) => {
  const id = req.params.id;
  Application.findById(id)
    .lean()
    .populate({
      path: 'customer',
    })
    .populate({
      path: 'listing',
      populate: {
        path: 'contractor',
      },
    })
    .then(async (application) => {
      const newApplication = { ...application };

      const categoryId = newApplication['listing']['category'] || '';
      if (categoryId) {
        const category = await Category.findById(categoryId);

        newApplication['listing']['category'] = category;
      }

      return res.json({ data: newApplication });
    })
    .catch((err) => {
      return res.sendStatus(400);
    });
});

// Get applications by contractor
router.get('/bycontractor', async function (req, res) {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    if (!token) return res.status(401).json({ msg: 'No token' });

    const decoded = jwt.verify(token, jwtSecret);
    const user = decoded;

    if (user.type === 'Customer') {
      return res.sendStatus(400);
    }
    const contractorId = user.id;

    let listings = await Listing.find({ contractor: contractorId });
    listings = listings.map((listing) => listing.id);

    Application.find({
      listing: { $in: listings },
    })
      .lean()
      .populate({
        path: 'customer',
      })
      .populate({
        path: 'listing',
        populate: {
          path: 'contractor',
        },
      })
      .then(async (applications) => {
        console.log('applications', applications);

        const newApplicationPromises = applications.map(async (element) => {
          const application = { ...element };
          if (
            application &&
            application['listing'] &&
            application['listing']['category']
          ) {
            const categoryId = application['listing']['category'] || '';
            if (categoryId) {
              const category = await Category.findById(categoryId);
              application['listing']['category'] = category;
              return application;
            }
            return application;
          } else {
            return application;
          }
        });
        const newApplications = await Promise.all(newApplicationPromises);
        return res.json({ data: newApplications });
      });
  } catch {
    return res.status(500).json({ msg: 'Internal error' });
  }
});

// Update application
router.put('/:id', async function (req, res) {
  const id = req.params.id;

  const {
    status,
    selectedTimeSlots,
    paymentMethod,
    note,
    upaymentStatus,
    amount,
    description,
  } = req.body;
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  const application = await Application.findById(id);
  if (!application) return res.sendStatus(400);

  let paymentStatus = 'unpaid';

  if (paymentMethod === 'stripe') {
    paymentStatus = 'paid';
  }

  if (application.status === 'pending' && user.type === 'Customer') {
    const formattedTimeSlotData = {};
    if (selectedTimeSlots) {
      Object.keys(selectedTimeSlots).forEach((dateString) => {
        formattedTimeSlotData[moment(dateString).format('L')] =
          selectedTimeSlots[dateString];
      });
      application.selectedTimeSlots = formattedTimeSlotData;
    }

    application.paymentMethod = paymentMethod;
    application.paymentStatus = paymentStatus;
    application.note = note;
    application.amount = amount;
    application.description = description;
    application.status = status;

    application
      .save()
      .then((application) => {
        res.json({ data: application });
      })
      .catch((e) => {
        return res.status(400).json({ msg: 'Error' });
      });
  } else if (
    (application.status === 'accepted' || application.status === 'completed') &&
    user.type === 'Customer'
  ) {
    const formattedTimeSlotData = {};
    if (selectedTimeSlots) {
      Object.keys(selectedTimeSlots).forEach((dateString) => {
        formattedTimeSlotData[moment(dateString).format('L')] =
          selectedTimeSlots[dateString];
      });
      application.selectedTimeSlots = formattedTimeSlotData;
    }

    application.paymentMethod = paymentMethod;
    application.note = note;
    application.paymentStatus = paymentStatus;
    application.amount = amount;
    application.description = description;
    application.status = status;

    application
      .save()
      .then((application) => {
        res.json({ data: application });
      })
      .catch((e) => {
        return res.status(400).json({ msg: 'Error' });
      });
  } else if (user.type === 'Contractor') {
    application.paymentStatus = upaymentStatus;
    application.description = description;
    application.status = status;

    application
      .save()
      .then((application) => {
        res.json({ data: application });
      })
      .catch((e) => {
        return res.status(400).json({ msg: 'Error' });
      });
  } else {
    if (!status) return res.sendStatus(400);

    if (application.closeDate < Date.now())
      return res.status(400).json({ msg: 'Application already closed' });

    if (status === 'Accepted') {
      const listing = await Listing.findById(application.listingId);

      // listing.numAccepted = listing.numAccepted + 1;

      await Application.updateMany(
        { customer: application.customerId, _id: { $ne: id } },
        { status: 'Rejected', closeDate: Date.now() }
      );
      listing.numAccepted += 1;
      await listing.save();
    }
    application.status = status;
    if (status === 'Accepted' || status === 'Rejected')
      application.closeDate = Date.now();
    const updatedApplication = await application.save();
    res.json({ application: updatedApplication });
  }
});

module.exports = router;
