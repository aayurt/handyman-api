const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const generateRandomLocation = () => {
  // Define longitude and latitude ranges for London
  const londonLongitudeRange = [0.127, 0.127999999]; // Example range for longitude
  const londonLatitudeRange = [51.5111111, 51.5999999]; // Example range for latitude

  // Generate random coordinates within London ranges
  const longitude = faker.number.float({
    min: londonLongitudeRange[0],
    max: londonLongitudeRange[1],
    precision: 0.000001,
  });
  const latitude = faker.number.float({
    min: londonLatitudeRange[0],
    max: londonLatitudeRange[1],
    precision: 0.000001,
  });

  return {
    type: 'Point',
    coordinates: [latitude, longitude],
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
  contractorData.push({
    name: 'Manish',
    email: 'mg@gmail.com',
    password: password,
    phone: '1-418-653-8049',
    bio: 'Facilis saepe blanditiis non magni vel qui ipsum numquam error.',
    gender: 'female',
    avatar: '/uploads/profile/test.jpg',
    address: '5769 Cremin Divide',
    location: { type: 'Point', coordinates: [51.514852, 0.127262] },
    skills: ['reflect', 'tailgate', 'avow'],
    experiences: [
      {
        employerName: 'Ziemann - Walter',
        startYear: '2022',
        role: 'Dynamic Infrastructure Planner',
        endYear: '2023',
        _id: { $oid: '64e77720747aa46ca6c44f5e' },
      },
    ],
    education: [
      {
        instituteName: 'Lowe LLC',
        startYear: '2023',
        endYear: '2023',
        _id: { $oid: '64e77720747aa46ca6c44f5f' },
      },
    ],
    numRatings: 0,
    ratingSum: 0,
  });
  contractorData.push({
    name: 'ManishG',
    email: 'mg1@gmail.com',
    password: password,
    phone: '1-418-653-8049',
    bio: 'Facilis saepe blanditiis non magni vel qui ipsum numquam error.',
    gender: 'female',
    avatar: '/uploads/profile/test.jpg',
    address: '5769 Cremin Divide',
    location: { type: 'Point', coordinates: [51.514852, 0.127262] },
    skills: ['reflect', 'tailgate', 'avow'],
    experiences: [
      {
        employerName: 'Ziemann - Walter',
        startYear: '2022',
        role: 'Dynamic Infrastructure Planner',
        endYear: '2023',
        _id: { $oid: '64e77720747aa46ca6c44f5e' },
      },
    ],
    education: [
      {
        instituteName: 'Lowe LLC',
        startYear: '2023',
        endYear: '2023',
        _id: { $oid: '64e77720747aa46ca6c44f5f' },
      },
    ],
    numRatings: 0,
    ratingSum: 0,
  });
}

module.exports = { contractorData };
