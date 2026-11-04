
const mongoose = require("mongoose");
const Opportunity = require("./models/Opportunity");

const opportunities = [
  {
    companyName: "TCS",
    jobTitle: "Software Developer Intern",
    location: "Pune, India",
    jobType: "Internship",
    description: "Work on software development, Java, SQL and problem-solving."
  },
  {
    companyName: "Infosys",
    jobTitle: "Systems Engineer Trainee",
    location: "Bengaluru, India",
    jobType: "Full-time",
    description: "Learn and work with programming, databases and software engineering."
  },
  {
    companyName: "Wipro",
    jobTitle: "Graduate Engineer Trainee",
    location: "Hyderabad, India",
    jobType: "Full-time",
    description: "Build programming and software development skills."
  },
  {
    companyName: "Accenture",
    jobTitle: "Application Developer Intern",
    location: "Gurugram, India",
    jobType: "Internship",
    description: "Work with web development, JavaScript and application APIs."
  },
  {
    companyName: "Capgemini",
    jobTitle: "Full Stack Developer Intern",
    location: "Noida, India",
    jobType: "Internship",
    description: "Practice frontend, backend and database development."
  }
];

async function seedOpportunities() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/careerforge"

    );

    for (const opportunity of opportunities) {
      await Opportunity.findOneAndUpdate(
        {
          companyName: opportunity.companyName,
          jobTitle: opportunity.jobTitle
        },
        { $set: opportunity },
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("5 sample opportunities added successfully!");
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedOpportunities();
