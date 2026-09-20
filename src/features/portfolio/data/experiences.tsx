import { CodeXmlIcon } from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "nairsolution",
    companyName: "Nair Solutions",
    companyLogo:
      "https://assets.nitishdeshmukh.com/images/companies/nair-solutions.svg",
    companyWebsite: "https://nairsolutions.org?atp=nitishdeshmukh",
    location: "Bhilai, Chhattisgarh, India",
    locationType: "On-site",
    positions: [
      {
        id: "1",
        title: "Full Stack Developer",
        employmentPeriod: {
          start: "09.2025",
          end: "06.2026",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Built and maintained **scalable backend services and RESTful APIs** using Python, FastAPI, and PostgreSQL.
- Developed user interfaces with **production-ready React components and reusable UI systems** based on design requirements.
- Implemented CDN-based media delivery infrastructure to improve **application performance and asset delivery**.
- Implemented on-page and technical SEO improvements to enhance **search engine visibility**.
- End-to-end integration across **frontend, backend, database, and infrastructure layers** to deliver production applications.`,
        skills: [
          "TypeScript",
          "Next.js",
          "Tailwind CSS",
          "React",
          "Motion",
          "ShadcnUI",
          "PostgreSQL",
          "Python",
          "FastAPI",
        ],
        isExpanded: true,
      },
      {
        id: "2",
        title: "Backend Developer",
        employmentPeriod: {
          start: "07.2024",
          end: "08.2024",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Designed and implemented **scalable backend services and RESTful APIs** for production applications.
- Developed **real-time communication** using Socket.io for an order management system.
- Integrated Cloudflare R2 for **scalable storage and management** of user-uploaded media.
- Worked with **Docker, Nginx, and cloud infrastructure** to support application deployment and production environments.`,
        skills: [
          "Express.js",
          "Node.js",
          "JavaScript",
          "MongoDB",
          "MySQL",
          "Docker",
          "Bun",
          "Nginx",
          "Cloudflare",
          "Socket.io",
        ],
      },
    ],
  },
  {
    id: "divyaltech",
    companyName: "Divyal Technologies",
    companyLogo:
      "https://assets.nitishdeshmukh.com/images/companies/divyal-technologies.svg",
    companyWebsite: "https://divyaltech.com?atp=nitishdeshmukh",
    location: "Bhilai, Chhattisgarh, India",
    locationType: "On-site",
    positions: [
      {
        id: "1",
        title: "Backend Developer",
        employmentPeriod: {
          start: "08.2024",
          end: "11.2024",
        },
        employmentType: "Internship",
        description: `- Designed and implemented **scalable backend services and RESTful APIs** for business applications.
- Integrated Monday.com for **real-time operational data tracking and workflow management**.
- Integrated AWS S3 for **scalable storage and management** of user-uploaded media.
- Developed code collaboratively using **Agile methodologies** throughout the application development lifecycle.`,
        icon: <CodeXmlIcon />,
        skills: ["Laravel", "MySQL", "Monday.com", "AWS S3", "Git", "GitHub"],
      },
    ],
  },
]
