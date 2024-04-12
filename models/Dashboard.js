import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Project Title",
      trim: true,
    },
    projectManager: {
      type: String,
      default: "John Doe",
      trim: true,
    },
    description: {
      type: String,
      default: "Project Description",
      trim: true,
    },
    teamMembers: [
      {
        name: {
          type: String,
        },
      },
    ],
    projectRisks: [
      {
        status: {
          type: String,
          enum: ["High", "Moderate", "Low"],
          default: "Low",
        },
        title: {
          type: String,
          trim: true,
          required: [true, "Please provide a title for the project risk"],
        },
        description: {
          type: String,
          trim: true,
          required: [true, "Please provide a description for the project risk"],
        },
      },
    ],
    functionalRequirements: [
      {
        title: {
          type: String,
          trim: true,
          required: [true, "Please provide a title for the functional requirement"],
        },
        description: {
          type: String,
          trim: true,
          required: [true, "Please provide a description for the functional requirement"],
        },
      },
    ],
    nonFunctionalRequirements: [
      {
        title: {
          type: String,
          trim: true,
          required: [true, "Please provide a title for the non-functional requirement"],
        },
        description: {
          type: String,
          trim: true,
          required: [true, "Please provide a description for the non-functional requirement"],
        },
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export const model = mongoose.model("Dashboard", DashboardSchema);
