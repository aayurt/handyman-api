const { faker } = require('@faker-js/faker');

const generateListing = (contractor, id) => {
  const listing = {
    category: id,
    contractor: {
      id: contractor._id,
      name: contractor.name,
      email: contractor.email,
      location: contractor.location,
    },
    title: faker.lorem.word(),
    numApps: faker.number.int(),
    numAccepted: faker.number.int(),
    deadlineDate: faker.date.future(),
    // duration: faker.number.int(),
    payRate: faker.number.int({ min: 5, max: 50 }),
    numRatings: faker.number.int(),
    ratingSum: faker.number.int(),
    deleted: false,
    postingDate: faker.date.past(),
  };

  return listing;
};

module.exports = { generateListing };
