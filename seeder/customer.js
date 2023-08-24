const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const generateRandomLocation = () => {
  return {
    type: 'Point',
    coordinates: [faker.location.longitude(), faker.location.latitude()],
  };
};

const generateRandomCustomer = async () => {
  let password = '';
  await bcrypt
    .hash('111111', 10)
    .then((hash) => {
      password = hash;
    })
    .catch((err) => console.error(err.message));
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: password,
    phone: faker.phone.number(),
    bio: faker.lorem.sentence(),
    avatar: '/uploads/profile/test.jpg',
    address: faker.location.streetAddress(),
    location: generateRandomLocation(),
  };
};

const numberOfCustomers = 10;
const customerData = [];

for (let i = 0; i < numberOfCustomers; i++) {
  generateRandomCustomer().then((val) => {
    customerData.push(val);
  });
}
module.exports = { customerData };
