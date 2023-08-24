// db.once('open', function () {
//   console.log('Connected to MongoDB database');

const { customerData } = require('./Customer');
const { contractorData } = require('./contractor');

// });
const Contractor = require('../models/Contractor');
const Customer = require('../models/Customer');
const { default: mongoose } = require('mongoose');
const db = require('../config/keys');
const { generateListing } = require('./listing');
const Listing = require('../models/Listing');
const Category = require('../models/Category');
const { generateCategories } = require('./categories');

const seedData = async () => {
  console.log('SEEDING');
  console.log(contractorData);
  console.log(customerData);
  // Connect to DB
  mongoose
    .connect(db.mongoURI, {
      dbName: db.dbName,
    })
    .then(async () => {
      console.log('Connected to database', db.mongoURI + '/' + db.dbName);
      try {
        await Contractor.deleteMany();
        await Customer.deleteMany();
        await Listing.deleteMany();
        await Category.deleteMany();

        const contractorList = await contractorData;
        const customerList = await customerData;
        const cateogryList = await generateCategories();

        const contractorListOb = await Contractor.insertMany(contractorList);
        await Customer.insertMany(customerList);
        const categoryListDb = await Category.insertMany(cateogryList);

        const listings = [];
        const categoryIdList = [];
        categoryListDb.forEach((element) => {
          categoryIdList.push(element._id);
        });

        contractorListOb.forEach((element) => {
          for (let i = 0; i < 10; i++) {
            var randomIndex = Math.floor(Math.random() * categoryIdList.length);
            var randomElement = categoryIdList[randomIndex];
            listings.push(generateListing(element, randomElement));
          }
        });
        await Listing.insertMany(listings);

        console.log('Users seeded successfully.');
        console.log('Seed completed.');

        process.exit();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })
    .catch((err) => console.log(err));
};
const destroyData = async () => {
  try {
    await User.deleteMany({
      email: {
        $in: ['admin@gmail.com', 'user@gmail.com'],
      },
    });

    console.log('Users Destroyed!');

    console.log('Destroy completed.');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
module.exports = seedData;
