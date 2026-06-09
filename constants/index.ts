import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewDomains = [
  {
    id: "sde1",
    title: "SDE 1",
    description: "Entry-level software development",
    icon: "💻",
    defaultRole: "Software Development Engineer 1",
    defaultTechstack: "JavaScript,Python,Data Structures,Algorithms",
    defaultType: "technical",
  },
  {
    id: "sde2",
    title: "SDE 2",
    description: "Mid-level software engineering",
    icon: "🖥️",
    defaultRole: "Software Development Engineer 2",
    defaultTechstack: "System Design,JavaScript,Python,AWS,Microservices",
    defaultType: "technical",
  },
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "UI/UX & web interfaces",
    icon: "🎨",
    defaultRole: "Frontend Developer",
    defaultTechstack: "React,TypeScript,CSS,Next.js,Tailwind CSS",
    defaultType: "technical",
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Server-side & APIs",
    icon: "⚙️",
    defaultRole: "Backend Developer",
    defaultTechstack: "Node.js,Express,MongoDB,PostgreSQL,REST APIs",
    defaultType: "technical",
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "End-to-end development",
    icon: "🔗",
    defaultRole: "Full Stack Developer",
    defaultTechstack: "React,Node.js,MongoDB,Express,TypeScript",
    defaultType: "mixed",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Data insights & visualization",
    icon: "📊",
    defaultRole: "Data Analyst",
    defaultTechstack: "SQL,Python,Excel,Tableau,Power BI",
    defaultType: "technical",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "ML & statistical modeling",
    icon: "🧠",
    defaultRole: "Data Scientist",
    defaultTechstack: "Python,TensorFlow,Pandas,Scikit-learn,SQL",
    defaultType: "technical",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "CI/CD & infrastructure",
    icon: "🚀",
    defaultRole: "DevOps Engineer",
    defaultTechstack: "Docker,Kubernetes,AWS,Jenkins,Terraform",
    defaultType: "technical",
  },
  {
    id: "marketing",
    title: "Marketing Manager",
    description: "Digital marketing & strategy",
    icon: "📣",
    defaultRole: "Marketing Manager",
    defaultTechstack: "SEO,Google Analytics,Social Media,Content Strategy,Email Marketing",
    defaultType: "behavioral",
  },
  {
    id: "sales",
    title: "Sales Executive",
    description: "Sales strategy & client relations",
    icon: "🤝",
    defaultRole: "Sales Executive",
    defaultTechstack: "CRM,Salesforce,Negotiation,Lead Generation,Pipeline Management",
    defaultType: "behavioral",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Product strategy & roadmap",
    icon: "📋",
    defaultRole: "Product Manager",
    defaultTechstack: "Agile,Jira,User Research,Roadmapping,A/B Testing",
    defaultType: "mixed",
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    description: "User experience & design",
    icon: "✏️",
    defaultRole: "UI/UX Designer",
    defaultTechstack: "Figma,Adobe XD,User Research,Wireframing,Prototyping",
    defaultType: "mixed",
  },
  {
    id: "mobile-dev",
    title: "Mobile Developer",
    description: "iOS & Android development",
    icon: "📱",
    defaultRole: "Mobile Developer",
    defaultTechstack: "React Native,Flutter,Swift,Kotlin,Firebase",
    defaultType: "technical",
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    description: "Testing & quality assurance",
    icon: "🔍",
    defaultRole: "QA Engineer",
    defaultTechstack: "Selenium,Cypress,Jest,Manual Testing,CI/CD",
    defaultType: "technical",
  },
  {
    id: "hr-recruiter",
    title: "HR / Recruiter",
    description: "Human resources & talent",
    icon: "👥",
    defaultRole: "HR Manager",
    defaultTechstack: "Talent Acquisition,Employee Relations,HR Analytics,Onboarding,Compliance",
    defaultType: "behavioral",
  },
];

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
