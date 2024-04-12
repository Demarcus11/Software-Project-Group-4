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

async function handleProjectDescriptionChange() {
  const newDescription = {
    description: projectDescriptionInputDOM.value,
  };

  const token = localStorage.getItem("token");
  try {
    await axios.patch(`${API_BASE_ROUTE}/dashboard/${dashboardId}/description`, newDescription, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error.response);
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
    await axios.patch(`${API_BASE_ROUTE}/dashboard/${dashboardId}/title`, newProjectTitle, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error.response);
  }
}

async function handleProjectManagerChange() {
  const newProjectManager = {
    projectManager: projectManagerNameDOM.value,
  };

  const token = localStorage.getItem("token");
  try {
    await axios.patch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/project-manager`,
      newProjectManager,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error.response);
  }
}

export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${API_BASE_ROUTE}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error.response);
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


*/
