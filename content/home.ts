export const homeContent = {
  brand: "UYE",
  brandName: "Unlock Your English",
  navigation: [
    { label: "About UYE", href: "#about" },
    { label: "Programme", href: "#program" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Why UYE", href: "#why-uye" },
    { label: "Our team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ],
  headerAction: {
    label: "Log in",
    href: "/login",
  },
  hero: {
    eyebrow: "An independent volunteer educational initiative",
    title: "Unlock Your English",
    description:
      "An entirely free, level-based programme delivered through an organised WhatsApp community, developing the six core English language skills.",
    primaryAction: {
      label: "Log in",
      href: "/login",
    },
    secondaryAction: { label: "Explore the programme", href: "#program" },
    supportingLine: "Free to join, structured by level, and built for steady progress.",
    lesson: {
      label: "This week’s plan",
      title: "Your English routine",
      progress: "Level 01",
      prompt: "Six core skills, one complete plan.",
      response: "Self-learning with guidance whenever you need it.",
      progressLabel: "Programme support",
      progressText: "Your next step is waiting",
    },
  },
  about: {
    eyebrow: "What is UYE?",
    title: "A structured, uncluttered place to learn.",
    description:
      "Unlock Your English is an independent volunteer educational initiative established to help anyone who wants to learn English through a structured and well-organised programme. Our team continuously develops and improves the programme to better meet the needs of our students.",
    mission: {
      title: "Our mission",
      description:
        "To provide a learning environment that helps every committed student develop their English skills in a practical and organised way.",
    },
  },
  programme: {
    eyebrow: "What do we offer?",
    title: "Six skills within one complete plan.",
    description:
      "UYE offers a level-based educational programme built on a comprehensive learning plan that helps students master the core English language skills through an organised WhatsApp community.",
    note: "The programme is primarily based on self-learning, with guidance and support provided whenever needed.",
    skills: [
      { number: "01", title: "Listening", description: "Train your ear to follow spoken English with confidence." },
      { number: "02", title: "Speaking", description: "Practical practice that builds fluency step by step." },
      { number: "03", title: "Reading", description: "Curated texts matched to each level." },
      { number: "04", title: "Writing", description: "Writing activities that develop the student’s own voice." },
      { number: "05", title: "Grammar", description: "A solid foundation, built up in sequence." },
      { number: "06", title: "Vocabulary", description: "Flashcards and weekly review for lasting retention." },
    ],
  },
  howItWorks: {
    eyebrow: "How does the programme work?",
    title: "From placement test to certificate.",
    description:
      "A clear path that begins by placing you at the right level and ends with a certificate that moves you to the next one.",
    steps: [
      {
        number: "01",
        title: "Placement test",
        description: "Available for new students, to ensure each learner joins the level that best matches their abilities.",
      },
      {
        number: "02",
        title: "The weekly plan",
        description: "Written and audio lessons, vocabulary flashcards, interactive activities and quizzes, plus live events from time to time.",
      },
      {
        number: "03",
        title: "End-of-level review",
        description: "Students’ performance and commitment are evaluated at the end of each level.",
      },
      {
        number: "04",
        title: "UYE certificate",
        description: "Students who meet the level requirements receive a certificate and become eligible to move on to the next level.",
      },
    ],
  },
  approach: {
    eyebrow: "Our approach",
    title: "A programme designed for purposeful progress.",
    points: [
      "We use British English throughout all programme content and encourage students to remain consistent with one English variety throughout their learning journey.",
      "Our curriculum is designed with the student’s environment in mind, while ensuring that the content is consistent with Islamic values and principles.",
    ],
  },
  why: {
    eyebrow: "Why UYE?",
    title: "Seven reasons to start today.",
    reasons: [
      "Free of charge",
      "A structured, level-based programme",
      "Uses reliable educational resources",
      "Combines self-learning with interactive activities",
      "A certificate upon completing each level",
      "A learning community that encourages consistency and engagement",
      "A volunteer team that provides support and answers students’ questions",
    ],
  },
  team: {
    eyebrow: "Our team",
    title: "The people behind UYE.",
    members: [
      "Layan Kuhail",
      "Nada Al-Hindi",
      "Yana Al-Jaidi",
      "Abdulrahman Ferwana",
      "Ahmad Abdullah",
      "Lara Afifa",
      "Layan Saeed",
      "Sara Qwaider",
    ],
  },
  contact: {
    eyebrow: "Contact us",
    title: "Have a question or suggestion?",
    description: "Reach out through either channel, and our team will get back to you as soon as possible.",
    channels: [
      {
        label: "WhatsApp community",
        description: "Join the learning community",
        action: "Join the community",
        icon: "whatsapp",
        href: "https://chat.whatsapp.com/CP4aKy73xxg59dpBGnMzL0",
      },
      {
        label: "Instagram",
        description: "Follow the latest news",
        action: "Follow us",
        icon: "instagram",
        href: "https://www.instagram.com/unlockyourenglishprogram",
      },
      {
        label: "Email",
        description: "Send us a message directly",
        action: "Send an email",
        icon: "email",
        href: "mailto:support@unlockyourenglish.com",
      },
    ],
  },
  closing: {
    title: "Are you ready to get started?",
    description: "Your English learning journey starts here. Join the UYE WhatsApp community today.",
    action: { label: "Join for free", href: "https://chat.whatsapp.com/CP4aKy73xxg59dpBGnMzL0" },
  },
  footer: {
    copyright: "© 2026 Unlock Your English (UYE). All rights reserved.",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/unlockyourenglishprogram" },
      { label: "Email", href: "mailto:support@unlockyourenglish.com" },
    ],
  },
} as const;
