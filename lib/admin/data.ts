import type { Level, Student } from "@/lib/admin/types";

export const initialStudents: Student[] = [
  { uid: "UY-10482", name: "Rania Nasser", email: "rania.nasser@email.com", password: "••••••••", level: "Beginner 2", progress: 72, status: "Active", levelOpen: true, initials: "RN", tone: "bg-[#e8e0ff] text-[#6346a6]" },
  { uid: "UY-10476", name: "Omar Khalil", email: "omar.khalil@email.com", password: "••••••••", level: "Intermediate 1", progress: 46, status: "Active", levelOpen: true, initials: "OK", tone: "bg-[#dceaff] text-[#3567a8]" },
  { uid: "UY-10463", name: "Lina Hammad", email: "lina.hammad@email.com", password: "••••••••", level: "Beginner 1", progress: 90, status: "Frozen", levelOpen: false, initials: "LH", tone: "bg-[#ffe3d3] text-[#a7522a]" },
  { uid: "UY-10458", name: "Yousef Salem", email: "yousef.salem@email.com", password: "••••••••", level: "Beginner 2", progress: 31, status: "Active", levelOpen: true, initials: "YS", tone: "bg-[#d9f3e7] text-[#27704d]" },
  { uid: "UY-10445", name: "Maya Darwish", email: "maya.darwish@email.com", password: "••••••••", level: "Intermediate 1", progress: 62, status: "Active", levelOpen: true, initials: "MD", tone: "bg-[#ffe8af] text-[#8d6513]" },
  { uid: "UY-10437", name: "Ahmad Jaber", email: "ahmad.jaber@email.com", password: "••••••••", level: "Advanced 1", progress: 18, status: "Active", levelOpen: true, initials: "AJ", tone: "bg-[#f1ddec] text-[#984b79]" },
];

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
