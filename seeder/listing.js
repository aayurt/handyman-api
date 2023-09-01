const { faker } = require("@faker-js/faker");

const generateListing = (contractor, id, title) => {
  const listing = {
    category: id,
    contractor: contractor._id,
    title: title,
    deadlineDate: faker.date.future(),
    // duration: faker.number.int(),
    payRate: faker.number.int({ min: 5, max: 50 }),
    description: faker.lorem.paragraph(),
    deleted: false,
    postingDate: faker.date.past(),
  };

  return listing;
};

module.exports = { generateListing };
