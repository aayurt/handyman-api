const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const generateRandomLocation = () => {
  return {
    type: 'Point',
    coordinates: [faker.location.longitude(), faker.location.latitude()],
  };
};

const generateRandomExperience = () => {
  return {
    employerName: faker.company.name(),
    startYear: faker.date.past().getFullYear().toString(),
    role: faker.person.jobTitle(),
    endYear: faker.date.past().getFullYear().toString(),
  };
};

const generateRandomEducation = () => {
  return {
    instituteName: faker.company.name(),
    startYear: faker.date.past().getFullYear().toString(),
    endYear: faker.date.past().getFullYear().toString(),
  };
};

const generateRandomProfile = async () => {
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
    gender: faker.helpers.arrayElement(['male', 'female', 'others']),
    phone: faker.phone.number(),
    bio: faker.lorem.sentence(),
    avatar: '/uploads/profile/test.jpg',
    address: faker.location.streetAddress(),
    location: generateRandomLocation(),
    linkedIn: faker.internet.url(),
    github: faker.internet.url(),
    website: faker.internet.url(),
    skills: [faker.word.verb(), faker.word.verb(), faker.word.verb()],
    interests: [faker.word.verb(), faker.word.verb()],
    experiences: [generateRandomExperience()],
    education: [generateRandomEducation()],
    numRatings: faker.number.int(),
    ratingSum: faker.number.int(),
  };
};

const numberOfProfiles = 10;
const contractorData = [];

for (let i = 0; i < numberOfProfiles; i++) {
  generateRandomProfile().then((val) => {
    contractorData.push(val);
  });
}

module.exports = { contractorData };
