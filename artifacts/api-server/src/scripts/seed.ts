import { db, usersTable, jobsTable } from "@workspace/db";
import { eq, like } from "drizzle-orm";

const SEED_PREFIX = "seed_";

const employers: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}> = [
  {
    id: `${SEED_PREFIX}gaza_sky_geeks`,
    name: "Gaza Sky Geeks",
    email: "info@gazaskygeeks.example",
    phone: "+970 8 286 0000",
    location: "Gaza City - Al-Rimal",
    bio: "Leading tech and entrepreneurship hub in Gaza, training developers and supporting startups since 2011.",
  },
  {
    id: `${SEED_PREFIX}unrwa_gaza`,
    name: "UNRWA - Gaza Field Office",
    email: "recruitment-gaza@unrwa.example",
    phone: "+970 8 288 7700",
    location: "Gaza City",
    bio: "United Nations Relief and Works Agency for Palestine Refugees, operating across health, education and relief services in Gaza.",
  },
  {
    id: `${SEED_PREFIX}prcs`,
    name: "Palestinian Red Crescent Society",
    email: "hr.gaza@prcs.example",
    phone: "+970 8 286 3633",
    location: "Gaza City - Tal Al-Hawa",
    bio: "Humanitarian organization providing emergency medical services, ambulance and disaster response across Gaza.",
  },
  {
    id: `${SEED_PREFIX}msf_gaza`,
    name: "Médecins Sans Frontières - Gaza",
    email: "msf-gaza-recruitment@msf.example",
    phone: "+970 8 282 0000",
    location: "Gaza City",
    bio: "International medical humanitarian organization running surgical, post-operative and burns programs in Gaza.",
  },
  {
    id: `${SEED_PREFIX}save_children`,
    name: "Save the Children - Palestine",
    email: "palestine.jobs@savethechildren.example",
    phone: "+970 8 282 1234",
    location: "Gaza City - Al-Nasr",
    bio: "Child-rights organization delivering education, child protection and emergency response programs in Gaza.",
  },
  {
    id: `${SEED_PREFIX}anera_gaza`,
    name: "Anera Gaza",
    email: "gaza-jobs@anera.example",
    phone: "+970 8 284 5566",
    location: "Gaza City - Omar Al-Mukhtar St.",
    bio: "American Near East Refugee Aid - relief, development, education and health programs for Palestinian communities.",
  },
  {
    id: `${SEED_PREFIX}islamic_university`,
    name: "Islamic University of Gaza",
    email: "careers@iugaza.example",
    phone: "+970 8 264 4400",
    location: "Gaza City - University District",
    bio: "Major higher-education institution in Gaza offering programs across engineering, medicine, IT and the humanities.",
  },
  {
    id: `${SEED_PREFIX}gaza_municipality`,
    name: "Gaza Municipality",
    email: "jobs@gaza-city.example",
    phone: "+970 8 286 4000",
    location: "Gaza City - Palestine Square",
    bio: "Local government authority serving Gaza City through public works, water, sanitation and urban services.",
  },
  {
    id: `${SEED_PREFIX}mercy_corps`,
    name: "Mercy Corps - Palestine",
    email: "palestine-jobs@mercycorps.example",
    phone: "+970 8 282 9999",
    location: "Gaza City",
    bio: "Global humanitarian and development organization working on economic recovery and youth empowerment in Gaza.",
  },
  {
    id: `${SEED_PREFIX}taawon`,
    name: "Taawon (Welfare Association)",
    email: "gaza-hr@taawon.example",
    phone: "+970 8 282 7711",
    location: "Gaza City",
    bio: "Palestinian non-profit supporting development projects across health, education, culture and community empowerment.",
  },
];

type SeedJob = {
  employerId: string;
  title: string;
  category: string;
  type: "online" | "field" | "hybrid";
  description: string;
  requirements: string;
  contactInfo: string;
};

const jobs: SeedJob[] = [
  {
    employerId: `${SEED_PREFIX}gaza_sky_geeks`,
    title: "Frontend Developer (React)",
    category: "Software Development",
    type: "hybrid",
    description:
      "Join the Gaza Sky Geeks engineering team to build modern web applications for international clients. You will collaborate with designers and backend engineers to ship production features, write clean component code, and participate in code reviews.",
    requirements:
      "- 1+ year of professional experience with React and TypeScript\n- Solid HTML / CSS / Tailwind skills\n- Comfortable consuming REST APIs\n- Working English (written)\n- Available 30+ hours per week",
    contactInfo: "Email: jobs@gazaskygeeks.example | Subject: Frontend Developer",
  },
  {
    employerId: `${SEED_PREFIX}gaza_sky_geeks`,
    title: "Junior UI/UX Designer",
    category: "Design",
    type: "hybrid",
    description:
      "Design intuitive interfaces for client web and mobile products. Translate user research into wireframes and high-fidelity mockups in Figma, and partner with developers during implementation.",
    requirements:
      "- Portfolio with 2+ shipped projects\n- Proficiency in Figma\n- Understanding of accessibility and responsive design\n- Communication in Arabic and English",
    contactInfo: "Apply with portfolio link to: design-jobs@gazaskygeeks.example",
  },
  {
    employerId: `${SEED_PREFIX}unrwa_gaza`,
    title: "Field Education Officer",
    category: "Education",
    type: "field",
    description:
      "Support UNRWA schools in Gaza by coordinating educational programs, monitoring classroom quality, and reporting on student outcomes across multiple field locations.",
    requirements:
      "- Bachelor's degree in Education or related field\n- 3+ years of experience in education or NGO work\n- Excellent reporting and documentation skills\n- Valid Palestinian ID and ability to travel within Gaza",
    contactInfo: "Apply via UNRWA portal: recruitment-gaza@unrwa.example",
  },
  {
    employerId: `${SEED_PREFIX}unrwa_gaza`,
    title: "Health Information Systems Assistant",
    category: "Healthcare",
    type: "field",
    description:
      "Maintain electronic health records across UNRWA primary health-care clinics in Gaza. Support clinic staff with data entry, basic troubleshooting, and reporting.",
    requirements:
      "- Diploma in IT, health informatics, or equivalent\n- Familiarity with electronic medical records\n- Strong attention to detail\n- Arabic native, working English",
    contactInfo: "Subject 'HIS Assistant - Gaza' to recruitment-gaza@unrwa.example",
  },
  {
    employerId: `${SEED_PREFIX}prcs`,
    title: "Emergency Medical Technician (EMT)",
    category: "Healthcare",
    type: "field",
    description:
      "Respond to emergency calls and provide pre-hospital care across Gaza. Operate within ambulance teams in coordination with Red Crescent dispatch, hospitals and partner agencies.",
    requirements:
      "- Certified EMT (basic or advanced)\n- Physical fitness and ability to work shifts\n- Valid driving license preferred\n- Commitment to humanitarian principles",
    contactInfo: "hr.gaza@prcs.example | mark CV with 'EMT - Gaza'",
  },
  {
    employerId: `${SEED_PREFIX}msf_gaza`,
    title: "Operating Theatre Nurse",
    category: "Healthcare",
    type: "field",
    description:
      "Support MSF surgical activities in Gaza hospitals. Prepare operating theatres, assist surgical teams, and ensure infection-control protocols across reconstructive and emergency procedures.",
    requirements:
      "- Bachelor's in Nursing + valid license\n- 2+ years OT experience\n- Working English\n- Available for rotating shifts",
    contactInfo: "msf-gaza-recruitment@msf.example",
  },
  {
    employerId: `${SEED_PREFIX}save_children`,
    title: "Child Protection Officer",
    category: "Social Work",
    type: "field",
    description:
      "Implement child protection activities in Gaza communities, including case management, psychosocial support sessions, and coordination with partner organizations.",
    requirements:
      "- Bachelor's in Social Work, Psychology or related\n- 2+ years in child protection or psychosocial support\n- Strong case-management skills\n- Arabic native, intermediate English",
    contactInfo: "palestine.jobs@savethechildren.example",
  },
  {
    employerId: `${SEED_PREFIX}anera_gaza`,
    title: "Monitoring & Evaluation Officer",
    category: "Project Management",
    type: "hybrid",
    description:
      "Design and run M&E systems for Anera projects in Gaza. Build indicators, collect field data, run beneficiary surveys and produce donor-ready reports.",
    requirements:
      "- Bachelor's in Statistics, Economics, Public Health or related\n- Hands-on experience with KoBo / ODK\n- Strong Excel; basic Power BI is a plus\n- Fluent Arabic and English",
    contactInfo: "gaza-jobs@anera.example",
  },
  {
    employerId: `${SEED_PREFIX}islamic_university`,
    title: "Teaching Assistant - Computer Science",
    category: "Education",
    type: "field",
    description:
      "Support faculty in the Computer Science department by assisting with labs, grading assignments and mentoring undergraduate students through programming coursework.",
    requirements:
      "- Bachelor's degree in Computer Science (Master's preferred)\n- Strong fundamentals in algorithms and OOP\n- Good teaching and communication skills",
    contactInfo: "careers@iugaza.example",
  },
  {
    employerId: `${SEED_PREFIX}gaza_municipality`,
    title: "Civil Engineer - Water & Sanitation",
    category: "Engineering",
    type: "field",
    description:
      "Plan and supervise water-network and sanitation projects across Gaza City. Coordinate with contractors, review designs, and ensure delivery on schedule and budget.",
    requirements:
      "- Bachelor's in Civil Engineer + Engineers' Syndicate membership\n- 3+ years in WASH infrastructure\n- AutoCAD and basic GIS\n- Project management exposure",
    contactInfo: "jobs@gaza-city.example | reference 'Civil Eng - WASH'",
  },
  {
    employerId: `${SEED_PREFIX}mercy_corps`,
    title: "Youth Livelihoods Coordinator",
    category: "Project Management",
    type: "hybrid",
    description:
      "Coordinate Mercy Corps' youth employment and entrepreneurship programs in Gaza. Build partnerships with local employers, run training cohorts and track participant outcomes.",
    requirements:
      "- 4+ years in livelihoods, TVET or youth programming\n- Strong stakeholder-management skills\n- Excellent reporting in English\n- Demonstrated experience with M&E",
    contactInfo: "palestine-jobs@mercycorps.example",
  },
  {
    employerId: `${SEED_PREFIX}taawon`,
    title: "Communications Officer",
    category: "Marketing & Communications",
    type: "hybrid",
    description:
      "Lead Taawon's external communications in Gaza: produce stories, manage social channels, support fundraising campaigns and document program impact.",
    requirements:
      "- Bachelor's in Media / PR / Journalism\n- 2+ years in NGO communications\n- Strong Arabic and English writing\n- Experience with photography / basic video editing is a plus",
    contactInfo: "gaza-hr@taawon.example",
  },
  {
    employerId: `${SEED_PREFIX}gaza_sky_geeks`,
    title: "Remote Customer Support Agent (English)",
    category: "Customer Support",
    type: "online",
    description:
      "Handle Tier-1 customer support tickets for an international SaaS client. Respond in clear English, escalate complex issues, and maintain a high CSAT score.",
    requirements:
      "- C1+ English (written)\n- Reliable internet and quiet workspace\n- Available for at least one weekend shift\n- Previous CS experience preferred but not required",
    contactInfo: "support-jobs@gazaskygeeks.example",
  },
  {
    employerId: `${SEED_PREFIX}save_children`,
    title: "Project Accountant",
    category: "Finance & Accounting",
    type: "field",
    description:
      "Manage day-to-day accounting for Save the Children Gaza programs: process payments, maintain ledgers, support budget tracking and prepare reports for donors.",
    requirements:
      "- Bachelor's in Accounting or Finance\n- 3+ years NGO accounting experience\n- Familiarity with grant compliance (USAID/EU)\n- Advanced Excel; QuickBooks or similar",
    contactInfo: "palestine.jobs@savethechildren.example",
  },
  {
    employerId: `${SEED_PREFIX}anera_gaza`,
    title: "Logistics Officer",
    category: "Logistics & Operations",
    type: "field",
    description:
      "Manage procurement, warehouse and distribution logistics for Anera relief operations in Gaza. Coordinate with suppliers and field teams to ensure timely delivery of supplies.",
    requirements:
      "- Bachelor's degree (Business, Logistics or related)\n- 2+ years in NGO logistics or supply chain\n- Familiarity with procurement procedures\n- Strong organizational skills",
    contactInfo: "gaza-jobs@anera.example",
  },
];

async function seed() {
  console.log("🌱  Seeding Fursa demo data...");

  let createdEmployers = 0;
  for (const e of employers) {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, e.id))
      .limit(1);
    if (existing[0]) continue;
    await db.insert(usersTable).values({
      id: e.id,
      name: e.name,
      email: e.email,
      role: "employer",
      phone: e.phone,
      location: e.location,
      bio: e.bio,
      isActive: true,
      onboarded: true,
    });
    createdEmployers++;
  }
  console.log(`  → ${createdEmployers} new employer(s) inserted (skipped existing).`);

  const existingJobs = await db
    .select({ id: jobsTable.id, title: jobsTable.title, employerId: jobsTable.employerId })
    .from(jobsTable)
    .where(like(jobsTable.employerId, `${SEED_PREFIX}%`));
  const existingKey = new Set(existingJobs.map((j) => `${j.employerId}|${j.title}`));

  let createdJobs = 0;
  for (const j of jobs) {
    if (existingKey.has(`${j.employerId}|${j.title}`)) continue;
    await db.insert(jobsTable).values({
      employerId: j.employerId,
      title: j.title,
      description: j.description,
      requirements: j.requirements,
      type: j.type,
      category: j.category,
      contactInfo: j.contactInfo,
      status: "approved",
      isOpen: true,
    });
    createdJobs++;
  }
  console.log(`  → ${createdJobs} new job(s) inserted (skipped existing).`);

  console.log("✅  Done. Demo data is now in your database.");
  console.log(
    "    Every record is tagged with an employer id starting with 'seed_'.",
  );
  console.log(
    "    You can delete any of these jobs later from the Admin → Jobs page.",
  );
}

seed()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
