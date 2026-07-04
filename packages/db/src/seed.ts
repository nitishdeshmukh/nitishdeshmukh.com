// Seed data for nitishdeshmukh.com
// Run: bun run db:seed (after D1 database is created)

export const seedData = {
  siteConfig: [
    { key: "name", value: "Nitish Deshmukh" },
    { key: "bio", value: "Part-Time Web Developer" },
    { key: "email", value: "contact@nitishdeshmukh.com" },
    { key: "profileImage", value: "/images/profile.jpg" },
    { key: "location", value: "India" },
  ],
  roles: [
    { title: "Full Stack Developer", order: 1 },
    { title: "Part-Time Web Developer", order: 2 },
    { title: "Open Source Enthusiast", order: 3 },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com/nitishdeshmukh", icon: "Github", order: 1 },
    { platform: "linkedin", url: "https://linkedin.com/in/nitish-deshmukh", icon: "Linkedin", order: 2 },
    { platform: "website", url: "https://nitishdeshmukh.com", icon: "Globe", order: 3 },
  ],
};
