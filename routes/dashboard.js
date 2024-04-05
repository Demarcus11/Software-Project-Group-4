import {
  getDashboardData,
  addTeamMember,
  updateTitle,
  addProjectRisk,
  addFunctionalReq,
  addNonFunctionalReq,
  updateProjectManager,
  updateFunctionalReq,
  updateNonFunctionalReq,
  updateProjectRisk,
  updateTeamMember,
  deleteTeamMember,
  deleteProjectRisk,
  deleteFunctionalReq,
  deleteNonFunctionalReq,
} from "../controllers/dashboard.js";
import express from "express";

// Initialize Router
export const router = express.Router();

// GET routes (Read)
router.route("/").get(getDashboardData);

// POST routes (Create)
router.route("/:dashboardId/team-members").post(addTeamMember);
router.route("/:dashboardId/project-risks").post(addProjectRisk);
router.route("/:dashboardId/functional-requirements").post(addFunctionalReq);
router.route("/:dashboardId/non-functional-requirements").post(addNonFunctionalReq);

// PATCH routes (Update)
router.route("/:dashboardId/title").patch(updateTitle);
router.route("/:dashboardId/project-manager").patch(updateProjectManager);
router.route("/:dashboardId/team-members/:id").patch(updateTeamMember);
router.route("/:dashboardId/project-risks/:id").patch(updateProjectRisk);
router.route("/:dashboardId/functional-requirements/:id").patch(updateFunctionalReq);
router.route("/:dashboardId/non-functional-requirements/:id").patch(updateNonFunctionalReq);

// DELETE routes (Delete)
router.route("/:dashboardId/team-members/:id").delete(deleteTeamMember);
router.route("/:dashboardId/project-risks/:id").delete(deleteProjectRisk);
router.route("/:dashboardId/functional-requirements/:id").delete(deleteFunctionalReq);
router.route("/:dashboardId/non-functional-requirements/:id").delete(deleteNonFunctionalReq);
