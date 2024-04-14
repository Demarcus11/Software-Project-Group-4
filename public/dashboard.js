import { fetchProjectRisks } from "./project-risks.js";
import { fetchFunctionalReqs } from "./functional-reqs.js";
import { fetchNonFunctionalReqs } from "./non-functional-reqs.js";
import { fetchTeamMembers } from "./team-members.js";

const projectTitleDOM = document.querySelector(".project__main-title");
const projectManagerNameDOM = document.querySelector(".project__owner-name");
const userDOM = document.querySelector(".project__user");
const projectRiskAmountDOM = document.querySelector("#project-risk-amount");
const projectFunctionalReqAmountDOM = document.querySelector("#project-functional-req-amount");
const projectNonFunctionalReqAmountDOM = document.querySelector(
  "#project-non-functional-req-amount"
);
const projectManagerEditBtn = document.querySelector(".project-manager-edit-btn");
const logoutBtn = document.querySelector(".log-out");
const projectDescriptionEditBtn = document.querySelector(".project-description-edit-btn");
const projectDescriptionInputDOM = document.querySelector(".project-description");

// Add toast library to give feedback when doing CRUD operations

export const API_BASE_ROUTE = "/api/v1";

const username = localStorage.getItem("username") || "";
export let dashboardId = "";

userDOM.textContent = username;

// Notifications
function alertSuccess(message) {
  Toastify({
    text: message,
    duration: 5000,
    close: false,
    gravity: "bottom",
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  }).showToast();
}

function alertError(message) {
  Toastify({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  }).showToast();
}

async function handleProjectDescriptionChange() {
  const newDescription = {
    description: projectDescriptionInputDOM.value,
  };

  const token = localStorage.getItem("token");
  try {
    const response = fetch(`${API_BASE_ROUTE}/dashboard/${dashboardId}/description`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDescription),
    });

    alertSuccess("Project description updated.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }
}

function handleLogoutClick() {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  window.location.href = "/";
}

async function handleProjectTitleChange() {
  const newProjectTitle = {
    title: projectTitleDOM.value,
  };

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_ROUTE}/dashboard/${dashboardId}/title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProjectTitle),
    });

    if (!response.ok) {
      return;
    }

    alertSuccess("Title saved.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }
}

async function handleProjectManagerChange() {
  const newProjectManager = {
    projectManager: projectManagerNameDOM.value,
  };

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_ROUTE}/dashboard/${dashboardId}/project-manager`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProjectManager),
    });

    if (!response.ok) {
      return;
    }

    alertSuccess("Project Manager updated.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }
}

export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE_ROUTE}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const displayDashboardData = async () => {
  const data = await fetchDashboardData();

  dashboardId = data.dashboards[0]._id;

  projectTitleDOM.value = data.dashboards[0].title;
  projectManagerNameDOM.value = data.dashboards[0].projectManager;
  projectRiskAmountDOM.textContent = data.dashboards[0].projectRisks.length;
  projectFunctionalReqAmountDOM.textContent = data.dashboards[0].functionalRequirements.length;
  projectNonFunctionalReqAmountDOM.textContent =
    data.dashboards[0].nonFunctionalRequirements.length;
  projectDescriptionInputDOM.value = data.dashboards[0].description;
  fetchProjectRisks(data);
  fetchFunctionalReqs(data);
  fetchNonFunctionalReqs(data);
  fetchTeamMembers(data);
};

await displayDashboardData();

// Event Listeners
projectTitleDOM.addEventListener("change", handleProjectTitleChange);
projectManagerEditBtn.addEventListener("click", () => {
  projectManagerNameDOM.focus();
  projectManagerNameDOM.selectionStart = projectManagerNameDOM.value.length;
  projectManagerNameDOM.scrollLeft = projectManagerNameDOM.scrollWidth;
});
projectManagerNameDOM.addEventListener("change", handleProjectManagerChange);
logoutBtn.addEventListener("click", handleLogoutClick);
projectDescriptionEditBtn.addEventListener("click", () => {
  projectDescriptionInputDOM.focus();
});
projectDescriptionInputDOM.addEventListener("change", handleProjectDescriptionChange);

/*

TODO

1. Toast library for visual confirmations

*/
