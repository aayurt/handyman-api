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
    gender: faker.helpers.arrayElement(["male", "female", "others"]),
    phone: faker.phone.number(),
    bio: faker.lorem.sentence(),
    avatar: "/uploads/profile/test.jpg",
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
let password = "$2a$10$BgTgNprlqyyM1D4Fsp7A5u9tyFoaAt95dWCl9AWpGcwwoy0Zz.QYq";
// await bcrypt
//   .hash("111111", 10)
//   .then((hash) => {
//     password = hash;
//   })
//   .catch((err) => console.error(err.message));

contractorData.push({
  name: "Manish Gurung",
  email: "mg@gmail.com",
  password: password,
  phone: "07470259087",
  bio: "I am an electrician that can take care of all your household electric needs.",
  gender: "male",
  avatar: "/uploads/profile/test.jpg",
  address: "9 Friday Road, DA8 1PL",
  location: { type: "Point", coordinates: [51.4839, 0.1666] },
  skills: ["wiring", "welding"],
  experiences: [
    {
      employerName: "Aayurt Shrestha",
      startYear: "2021",
      role: "Electric Technicial",
      endYear: "2022",
    },
  ],
  education: [
    {
      instituteName: "Kingston University",
      startYear: "2020",
      endYear: "2021",
    },
  ],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "Emily Turner",
  email: "emilyt@gmail.com",
  password: password,
  phone: "07551234567",
  bio: "Experienced painter offering high-quality painting services for your home or business.",
  gender: "female",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "59 Eardley Rd, Belvedere DA17 6EX",
  location: { type: "Point", coordinates: [51.485146, -0.150388] },
  skills: ["painting", "color mixing"],
  experiences: [
    {
      employerName: "BrightBrush Painters",
      startYear: "2020",
      role: "Painter",
      endYear: "2022",
    },
  ],
  education: [],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "Michael Brown",
  email: "michaelb@gmail.com",
  password: password,
  phone: "07481234567",
  bio: "Skilled electrician providing expert electrical services for residential and commercial clients.",
  gender: "male",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "7 Birkdale Rd, London SE2 9HU",
  location: { type: "Point", coordinates: [51.48958, 0.103737] },
  skills: ["wiring", "circuit design"],
  experiences: [
    {
      employerName: "EcoSpark Electric",
      startYear: "2018",
      role: "Electrician",
      endYear: "2023",
    },
  ],
  education: [
    {
      instituteName: "London Electrical Academy",
      startYear: "2017",
      endYear: "2018",
    },
  ],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "Sophie Martinez",
  email: "sophiem@gmail.com",
  password: password,
  phone: "07460234567",
  bio: "Experienced hairdresser specializing in haircuts, styling, and color treatments.",
  gender: "female",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "22 Vicarage Rd, London SE18 7SP",
  location: { type: "Point", coordinates: [51.484862, 0.077334] },
  skills: ["haircutting", "styling"],
  experiences: [
    {
      employerName: "Glamour Cuts Salon",
      startYear: "2019",
      role: "Hairdresser",
      endYear: "2023",
    },
  ],
  education: [],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "Daniel Lopez",
  email: "daniell@gmail.com",
  password: password,
  phone: "07470234567",
  bio: "Dedicated caregiver providing compassionate support and assistance to individuals in need.",
  gender: "male",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "Central Court, 111 Woolwich New Rd, London SE18 6EZ",
  location: { type: "Point", coordinates: [51.4879, 0.0663] },
  skills: ["caregiving", "companionship"],
  experiences: [
    {
      employerName: "ElderlyCare Services",
      startYear: "2020",
      role: "Caregiver",
      endYear: "2023",
    },
  ],
  education: [
    {
      instituteName: "London Care Institute",
      startYear: "2019",
      endYear: "2020",
    },
  ],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "David Mitchell",
  email: "davidm@gmail.com",
  password: password,
  phone: "07480234567",
  bio: "Experienced plumber specializing in pipe repairs, installations, and maintenance.",
  gender: "male",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "17 Mc Call Cres, London SE7 8HS",
  location: { type: "Point", coordinates: [51.484238, 0.045345] },
  skills: ["plumbing", "pipe fitting"],
  experiences: [
    {
      employerName: "SwiftFlow Plumbing",
      startYear: "2018",
      role: "Plumber",
      endYear: "2023",
    },
  ],
  education: [],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "Laura Turner",
  email: "laurat@gmail.com",
  password: password,
  phone: "07451234567",
  bio: "Skilled carpenter offering custom woodwork, furniture construction, and repairs.",
  gender: "female",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "9a Ripley Rd, London E16 3EA",
  location: { type: "Point", coordinates: [51.513498, 0.033064] },
  skills: ["carpentry", "woodworking"],
  experiences: [
    {
      employerName: "CraftWood Creations",
      startYear: "2019",
      role: "Carpenter",
      endYear: "2023",
    },
  ],
  education: [],
  numRatings: 0,
  ratingSum: 0,
});

// Gardeners
contractorData.push({
  name: "Robert Green",
  email: "robertg@gmail.com",
  password: password,
  phone: "07461234567",
  bio: "Professional gardener offering landscaping, lawn care, and garden maintenance services.",
  gender: "male",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "12A Hartley Ave, London E6 1NT",
  location: { type: "Point", coordinates: [51.535, 0.0545] },
  skills: ["gardening", "landscaping"],
  experiences: [
    {
      employerName: "GreenThumb Gardens",
      startYear: "2020",
      role: "Gardener",
      endYear: "2023",
    },
  ],
  education: [],
  numRatings: 0,
  ratingSum: 0,
});

contractorData.push({
  name: "Alice Wood",
  email: "alicew@gmail.com",
  password: password,
  phone: "07472234567",
  bio: "Passionate gardener with a green thumb, specializing in plant care and garden design.",
  gender: "female",
  avatar: "/uploads/profile/test.jpg", // Use the same avatar path
  address: "189 Longlands Rd, Sidcup DA15 7LB",
  location: { type: "Point", coordinates: [51.432733, 0.099412] },
  skills: ["gardening", "plant care"],
  experiences: [
    {
      employerName: "Blooming Gardens",
      startYear: "2019",
      role: "Gardener",
      endYear: "2023",
    },
  ],
  education: [],
  numRatings: 0,
  ratingSum: 0,
});

module.exports = { contractorData };
