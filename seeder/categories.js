const { faker } = require("@faker-js/faker");

const generateCategories = () => {
  return [
    {
      title: "Electronic",
      description:
        "Explore the world of electronics and find experts for your electronic needs.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Mechanic",
      description:
        "Get your vehicle in top shape with skilled mechanics ready to assist you.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Plumber",
      description:
        "Solve plumbing issues in your home or office with experienced plumbers.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Software Engineer",
      description:
        "Build software solutions with the expertise of software engineers.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Software Architect",
      description:
        "Design and plan software projects with seasoned software architects.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Carpenter",
      description:
        "Transform your space with the craftsmanship of skilled carpenters.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Electrician",
      description:
        "Ensure your electrical systems are safe and functional with electricians.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Hair Dresser",
      description:
        "Revamp your hairstyle and look your best with professional hairdressers.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Painter",
      description:
        "Add a splash of color to your surroundings with talented painters.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Care Giver",
      description:
        "Provide compassionate care and support for your loved ones with caregivers.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Masseuse",
      description:
        "Relax and unwind with the healing touch of skilled masseuses. Treat yourself to a soothing massage experience.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Graphic Designer",
      description:
        "Elevate your brand and visuals with the creativity of graphic designers. Get stunning designs for your projects.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Photographer",
      description:
        "Capture memories that last a lifetime with professional photographers. Preserve your special moments with style.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Event Planner",
      description:
        "Create unforgettable events with the expertise of event planners. From weddings to parties, they make it memorable.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Landscaper",
      description:
        "Transform your outdoor space into a beautiful oasis with the skills of landscapers. Enhance your surroundings.",
      image: "/uploads/profile/test.jpg",
    },
    {
      title: "Plasterer",
      description:
        "Achieve smooth and polished walls with the precision of plasterers. They ensure a flawless finish for your interiors.",
      image: "/uploads/profile/test.jpg",
    },
  ];
};

module.exports = { generateCategories };
