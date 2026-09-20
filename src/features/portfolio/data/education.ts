import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "sstc",
    school: "Shri Shankracharya Technical Campus, Bhilai",
    degree: "Bachelor’s degree",
    fieldOfStudy: "Computer Science and Engineering (Data Science)",
    period: {
      start: "07.2021",
      end: "06.2025",
    },
    description: ``,
    skills: [
      "Python",
      "DSA",
      "Machine Learning",
      "Computer Vision",
      "Deep Learning",
      "Data Science",
    ],
  },
  {
    id: "high-school",
    school: "Govt. Higher Secondary School, Chikhali",
    fieldOfStudy: "PCM",
    period: {
      start: "06.2020",
      end: "05.2021",
    },
    description: ``,
    skills: ["Physics", "Chemistry", "Mathematics"],
  },
]
