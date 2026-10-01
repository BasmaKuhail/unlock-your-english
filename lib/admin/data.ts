import type { Level, Student } from "@/lib/admin/types";

export const initialLevels: Level[] = [
  {
    id: 1,
    title: "Beginner 1",
    description: "Everyday English foundations",
    students: 38,
    sections: [
      { id: 1, title: "Greetings and introductions", document: "lesson-01-greetings.pdf" },
      { id: 2, title: "Talking about yourself", document: "lesson-02-about-you.pdf" },
      { id: 3, title: "Numbers and time", document: "lesson-03-time.pdf" },
    ],
  },
  {
    id: 2,
    title: "Beginner 2",
    description: "Useful conversations for daily life",
    students: 42,
    sections: [
      { id: 1, title: "Daily routines", document: "lesson-01-routines.pdf" },
      { id: 2, title: "At the market", document: "lesson-02-market.pdf" },
    ],
  },
  {
    id: 3,
    title: "Intermediate 1",
    description: "Speak with more fluency and detail",
    students: 29,
    sections: [
      { id: 1, title: "Sharing opinions", document: "lesson-01-opinions.pdf" },
      { id: 2, title: "Making plans", document: "lesson-02-plans.pdf" },
      { id: 3, title: "Telling stories", document: "lesson-03-stories.pdf" },
      { id: 4, title: "Work and study", document: "lesson-04-work.pdf" },
    ],
  },
  {
    id: 4,
    title: "Advanced 1",
    description: "Confident English for real situations",
    students: 16,
    sections: [
      { id: 1, title: "Presenting an idea", document: "lesson-01-presenting.pdf" },
      { id: 2, title: "Solving problems", document: "lesson-02-problems.pdf" },
    ],
  },
];
