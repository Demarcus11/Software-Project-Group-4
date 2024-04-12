import { model as Dashboard } from "../models/Dashboard.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/NotFound.js";
import { BadRequestError } from "../errors/BadRequestError.js";

// Get dashboard for authenticated user and send repsonse back to the frontend
export const getDashboardData = async (req, res) => {
  const dashboards = await Dashboard.find({ createdBy: req.user.userId }).sort("createdBy"); // what is sort doing?
  res.status(StatusCodes.OK).json({ count: dashboards.length, dashboards });
};

export const updateTitle = async (req, res) => {
  const {
    body: { title },
    user: { userId },
    params: { dashboardId },
  } = req;

  if (title === "") {
    throw new BadRequestError("Please provide a title");
  }

  const updatedTitle = await Dashboard.findOneAndUpdate(
    {
      _id: dashboardId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedTitle) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  res.status(StatusCodes.OK).send();
};

// Update dashboard title
export const updateProjectManager = async (req, res) => {
  const {
    body: { projectManager },
    user: { userId },
    params: { dashboardId },
  } = req;

  if (projectManager === "") {
    throw new BadRequestError("Please provide a title");
  }

  const updatedProjectManager = await Dashboard.findOneAndUpdate(
    {
      _id: dashboardId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProjectManager) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  res.status(StatusCodes.OK).send();
};

export const updateDescription = async (req, res) => {
  const {
    body: { description },
    user: { userId },
    params: { dashboardId },
  } = req;

  if (description === "") {
    throw new BadRequestError("Please provide a description");
  }

  const updatedDescription = await Dashboard.findOneAndUpdate(
    {
      _id: dashboardId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedDescription) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  res.status(StatusCodes.OK).send();
};

export const updateTeamMember = async (req, res) => {
  const {
    user: { userId },
    params: { dashboardId, id: teamMemberId },
  } = req;

  const updatedTeamMember = await Dashboard.findOneAndUpdate(
    {
      _id: dashboardId,
      createdBy: userId,
      "teamMembers._id": teamMemberId,
    },
    { $set: { "teamMembers.$.name": req.body.name } },
    { new: true, runValidators: true }
  );

  if (!updatedTeamMember) {
    throw new NotFoundError(`No team member with id: ${teamMemberId}`);
  }

  res.status(StatusCodes.OK).send();
};

export const updateProjectRisk = async (req, res) => {
  const {
    body: { status, title, description },
    user: { userId },
    params: { dashboardId, id: projectRiskId },
  } = req;

  const updateFields = {};
  if (title) updateFields["projectRisks.$.title"] = title;
  if (description) updateFields["projectRisks.$.description"] = description;
  if (status) updateFields["projectRisks.$.status"] = status;

  const updatedProjectRisk = await Dashboard.updateMany(
    {
      _id: dashboardId,
      createdBy: userId,
      "projectRisks._id": projectRiskId,
    },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  // Check if any project risks were updated
  if (updatedProjectRisk.nModified === 0) {
    throw new NotFoundError(`No project risk with id: ${projectRiskId}`);
  }

  res.status(StatusCodes.OK).send();
};

export const updateFunctionalReq = async (req, res) => {
  const {
    body: { title, description },
    user: { userId },
    params: { dashboardId, id: functionalReqId },
  } = req;

  const updateFields = {};
  if (title) updateFields["functionalRequirements.$.title"] = title;
  if (description) updateFields["functionalRequirements.$.description"] = description;

  const updatedFunctionalReq = await Dashboard.updateMany(
    {
      _id: dashboardId,
      createdBy: userId,
      "functionalRequirements._id": functionalReqId,
    },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  // Check if any project risks were updated
  if (updatedFunctionalReq.nModified === 0) {
    throw new NotFoundError(`No functional requirement with id: ${functionalReqId}`);
  }

  res.status(StatusCodes.OK).send();
};

export const updateNonFunctionalReq = async (req, res) => {
  const {
    body: { title, description },
    user: { userId },
    params: { dashboardId, id: nonFunctionalReqId },
  } = req;

  const updateFields = {};
  if (title) updateFields["nonFunctionalRequirements.$.title"] = title;
  if (description) updateFields["nonFunctionalRequirements.$.description"] = description;

  const updatedNonFunctionalReq = await Dashboard.updateMany(
    {
      _id: dashboardId,
      createdBy: userId,
      "nonFunctionalRequirements._id": nonFunctionalReqId,
    },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  // Check if any project risks were updated
  if (updatedNonFunctionalReq.nModified === 0) {
    throw new NotFoundError(`No Non-Functional requirement with id: ${nonFunctionalReqId}`);
  }

  res.status(StatusCodes.OK).send();
};

// Pass in an object with a name property: { name: "Some name" }, don't pass in an array
export const addProjectRisk = async (req, res) => {
  const {
    body,
    user: { userId },
    params: { dashboardId },
  } = req;

  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Add the new team member to the array of team members in the dashboard
  dashboard.projectRisks.push(body);

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.CREATED).json(dashboard);
};

export const addTeamMember = async (req, res) => {
  const {
    body,
    user: { userId },
    params: { dashboardId },
  } = req;

  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Add the new team member to the array of team members in the dashboard
  dashboard.teamMembers.push(body);

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.CREATED).json(dashboard);
};

export const addFunctionalReq = async (req, res) => {
  const {
    body,
    user: { userId },
    params: { dashboardId },
  } = req;

  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Add the new team member to the array of team members in the dashboard
  dashboard.functionalRequirements.push(body);

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.CREATED).json(dashboard);
};

export const addNonFunctionalReq = async (req, res) => {
  const {
    body,
    user: { userId },
    params: { dashboardId },
  } = req;

  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Add the new team member to the array of team members in the dashboard
  dashboard.nonFunctionalRequirements.push(body);

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.CREATED).json(dashboard);
};

export const deleteProjectRisk = async (req, res) => {
  const {
    params: { dashboardId, id: projectRiskId },
    user: { userId },
  } = req;

  // Find the dashboard document
  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  // Check if the dashboard exists
  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Pull the team member with the given ID from the teamMembers array
  dashboard.projectRisks.pull({ _id: projectRiskId });

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.OK).json(dashboard);
};

export const deleteFunctionalReq = async (req, res) => {
  const {
    params: { dashboardId, id: functionalReqId },
    user: { userId },
  } = req;

  // Find the dashboard document
  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  // Check if the dashboard exists
  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Pull the team member with the given ID from the teamMembers array
  dashboard.functionalRequirements.pull({ _id: functionalReqId });

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.OK).json(dashboard);
};

export const deleteTeamMember = async (req, res) => {
  const {
    params: { dashboardId, id: teamMemberId },
    user: { userId },
  } = req;

  // Find the dashboard document
  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  // Check if the dashboard exists
  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Pull the team member with the given ID from the teamMembers array
  dashboard.teamMembers.pull({ _id: teamMemberId });

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.OK).json(dashboard);
};

export const deleteNonFunctionalReq = async (req, res) => {
  const {
    params: { dashboardId, id: nonFunctionalReqId },
    user: { userId },
  } = req;

  console.log(nonFunctionalReqId);

  // Find the dashboard document
  const dashboard = await Dashboard.findOne({ _id: dashboardId, createdBy: userId });

  // Check if the dashboard exists
  if (!dashboard) {
    throw new NotFoundError(`No dashboard with id: ${dashboardId}`);
  }

  // Pull the team member with the given ID from the teamMembers array
  dashboard.nonFunctionalRequirements.pull({ _id: nonFunctionalReqId });

  // Save the updated dashboard
  await dashboard.save();

  res.status(StatusCodes.OK).json(dashboard);
};
