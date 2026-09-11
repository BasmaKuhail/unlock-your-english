export const homeContent = {
  brand: "uye.",
  navigation: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Learning paths", href: "#learning-paths" },
    { label: "For schools", href: "#for-schools" },
  ],
  hero: {
    eyebrow: "English that fits your life",
    title: "Learn to speak English with confidence.",
    description:
      "Build a lasting habit with short, practical lessons made for the conversations you want to have.",
    primaryAction: { label: "Log in to learn", href: "/login" },
    secondaryAction: { label: "See how it works", href: "#how-it-works" },
    socialProof: "Loved by learners in 120+ countries",
    lesson: {
      label: "Today’s lesson",
      title: "Making plans",
      progress: "3 of 5",
      prompt: "Are you free this weekend?",
      response: "Yes, I’d love to!",
    },
  },
} as const;
