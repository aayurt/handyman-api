const { faker } = require('@faker-js/faker');

const generateCategories = () => {
  return [
    {
      title: 'Electronic',
      description: faker.lorem.paragraph(),
      image: '/uploads/profile/test.jpg',
    },
    {
      title: 'Mechanic',
      description: faker.lorem.paragraph(),
      image: '/uploads/profile/test.jpg',
    },
    {
      title: 'Plumber',
      description: faker.lorem.paragraph(),
      image: '/uploads/profile/test.jpg',
    },
    {
      title: 'Software Engineer',
      description: faker.lorem.paragraph(),
      image: '/uploads/profile/test.jpg',
    },
    {
      title: 'Software Architect',
      description: faker.lorem.paragraph(),
      image: '/uploads/profile/test.jpg',
    },
  ];
};

module.exports = { generateCategories };
