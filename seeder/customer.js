const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

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
    type: "Point",
    coordinates: [latitude, longitude],
  };
};

const generateRandomCustomer = async () => {
  let password = "";
  await bcrypt
    .hash("111111", 10)
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
    avatar: "/uploads/profile/test.jpg",
    address: faker.location.streetAddress(),
    location: generateRandomLocation(),
  };
};

const numberOfCustomers = 10;
const customerData = [];
let password = "$2a$10$BgTgNprlqyyM1D4Fsp7A5u9tyFoaAt95dWCl9AWpGcwwoy0Zz.QYq";
// await bcrypt
//   .hash("111111", 10)
//   .then((hash) => {
//     password = hash;
//   })
//   .catch((err) => console.error(err.message));

customerData.push({
  name: "test",
  email: "test2@gmail.com",
  password: password,
  gender: "male",
  phone: "07450829056",
  bio: "Hello, I am a 21 year old male looking for home improvements.",
  avatar: "/uploads/profile/test.jpg",
  address: "26 Strand Court, 33 Strandfield Close",
  location: { type: "Point", coordinates: [51.5, 0.127] },
});

// Customer 1
customerData.push({
  name: "John Smith",
  email: "john.smith@gmail.com",
  password: password,
  gender: "male",
  phone: "07460234567",
  bio: "Hi, I'm John, a homeowner interested in home renovation projects.",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "4 Nairne Grove, London SE24 9PU",
  location: { type: "Point", coordinates: [51.4576, -0.0904] },
});

// Customer 2
customerData.push({
  name: "Emily Johnson",
  email: "emily.j@gmail.com",
  password: password,
  gender: "female",
  phone: "07471234567",
  bio: "Hello, I'm Emily, and I'm looking to enhance my living space with interior design.",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "3 Brantwood Rd, London SE24 0DH",
  location: { type: "Point", coordinates: [51.4581, -0.0992] },
});

// Customer 3
customerData.push({
  name: "Sophie Martinez",
  email: "sophie.m@gmail.com",
  password: password,
  gender: "female",
  phone: "07482234567",
  bio: "Hey there, I'm Sophie, and I'm excited to make my garden beautiful.",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "41 Heath Rd, Thornton Heath CR7 8NF",
  location: { type: "Point", coordinates: [51.4031, -0.0994] },
});

// Customer 4
customerData.push({
  name: "Daniel Lopez",
  email: "daniel.l@gmail.com",
  password: password,
  gender: "male",
  phone: "07493234567",
  bio: "Hi, I'm Daniel, and I need some help with home repairs and maintenance.",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "65 Furze Rd, Thornton Heath CR7 8NJ",
  location: { type: "Point", coordinates: [51.4039, -0.0978] },
});

// Customer 5
customerData.push({
  name: "Laura Turner",
  email: "laura.t@gmail.com",
  password: password,
  gender: "female",
  phone: "07460234568", // Different phone number
  bio: "Hello, I'm Laura, and I'm interested in home improvement and renovations.",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "7 Greenleaf Rd, London E6 1DX",
  location: { type: "Point", coordinates: [51.5348, 0.0367] },
});

// Customer 6
customerData.push({
  name: "David Mitchell",
  email: "david.m@gmail.com",
  password: password,
  gender: "male",
  phone: "07470234568", // Different phone number
  bio: "Hi, I'm David, and I'm looking to remodel my kitchen and bathroom.",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "107 Harold Rd, London E13 0SG",
  location: { type: "Point", coordinates: [51.5348, 0.0316] },
});

module.exports = { customerData };
