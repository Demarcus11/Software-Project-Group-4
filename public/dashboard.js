import { fetchProjectRisks } from "./project-risks.js";
import { fetchFunctionalReqs } from "./functional-reqs.js";
import { fetchNonFunctionalReqs } from "./non-functional-reqs.js";
import { fetchTeamMembers } from "./team-members.js";

const projectTitleDOM = document.querySelector(".project__main-title");
const projectManagerDOM = document.querySelector(".project__owner-name");
const userDOM = document.querySelector(".project__user");

// Add toast library to give feedback when doing CRUD operations

export const API_BASE_ROUTE = "/api/v1";

const username = localStorage.getItem("username") || "";
export let dashboardId = "";

userDOM.textContent = username;

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
  projectManagerDOM.value = data.dashboards[0].projectManager;
  fetchProjectRisks(data);
  fetchFunctionalReqs(data);
  fetchNonFunctionalReqs(data);
  fetchTeamMembers(data);
};

await displayDashboardData();

// Update Project Risks - CRUD
// const editProjectRiskModalDOM = document.querySelector("#edit-project-risk-modal");
// const editProjectRiskBtns = document.querySelectorAll(".project-risk-edit-btn");
// const projectRiskIdDOM = document.querySelector("#project-risk-id");
// const projectRiskTitleDOM = document.querySelector(".project-risk-name");
// const projectRiskDescriptionDOM = document.querySelector(".project-risk-description");
// let projectRiskId = "";

// const handleEditProjectRisk = async (e) => {
//   editProjectRiskModalDOM.showModal();

//   const clickedElement = e.target;
//   const projectRiskElement = clickedElement.closest(".project__section-card");

//   if (projectRiskElement) {
//     projectRiskId = projectRiskElement.dataset.id;

//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`${API_BASE_ROUTE}/dashboard`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       for (const risk of data.dashboards[0].projectRisks) {
//         if (risk._id === projectRiskId) {
//           let { _id: projectRiskID, title, description } = risk;
//           projectRiskIdDOM.textContent = projectRiskID;
//           projectRiskTitleDOM.value = title;
//           projectRiskDescriptionDOM.value = description;
//         }
//       }
//     } catch (error) {
//       console.log(error.response);
//     }
//   }
// };

// GET request to "/" to fetch the user's dashboard data
// const fetchDashboardData = async () => {
//   const token = localStorage.getItem("token");

//   try {
//     const { data } = await axios.get(`${API_BASE_ROUTE}/dashboard`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     dashboardId = data.dashboards[0]._id;

//     projectTitleDOM.value = data.dashboards[0].title;
//     projectManagerDOM.value = data.dashboards[0].projectManager;
//     fetchProjectRisks(data);
//     fetchFunctionalReqs(data);
//     fetchNonFunctionalReqs(data);
//     fetchTeamMembers(data);
//   } catch (error) {
//     console.log(error.response);
//   }
// };

// await fetchDashboardData();

// Event Listeners

// Update Title - CRUD
// projectTitleDOM.addEventListener("change", async () => {
//   const token = localStorage.getItem("token");

//   try {
//     await axios.patch(
//       `${API_BASE_ROUTE}/dashboard/${dashboardId}/title`,
//       {
//         title: projectTitleDOM.value,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     await fetchDashboardData();
//   } catch (error) {
//     console.log(error.response);
//   }
// });

// // Update Project Manager - CRUD
// const projectManagerEditBtn = document.querySelector(".project-manager-edit-btn");
// projectManagerEditBtn.addEventListener("click", async () => {
//   projectManagerDOM.focus();
//   projectManagerDOM.selectionStart = projectManagerDOM.value.length;
//   projectManagerDOM.scrollLeft = projectManagerDOM.scrollWidth;
// });

// projectManagerDOM.addEventListener("change", async () => {
//   const token = localStorage.getItem("token");
//   try {
//     await axios.patch(
//       `${API_BASE_ROUTE}/dashboard/${dashboardId}/project-manager`,
//       {
//         projectManager: projectManagerDOM.value,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//   } catch (error) {
//     console.log(error.response);
//   }
// });

// const projectRiskFormDOM = document.querySelector(".edit-modal__form");
// const handleProjectRiskEditSubmit = async () => {
//   const token = localStorage.getItem("token");

//   const newProjectRiskTitle = projectRiskTitleDOM.value;
//   const newProjectRiskDescription = projectRiskDescriptionDOM.value;
//   try {
//     await axios.patch(
//       `${API_BASE_ROUTE}/dashboard/${dashboardId}/project-risks/${projectRiskId}`,
//       {
//         title: newProjectRiskTitle,
//         description: newProjectRiskDescription,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     editProjectRiskModalDOM.close();
//     await fetchDashboardData();
//   } catch (error) {
//     console.log(error.response);
//   }
// };

// projectRiskFormDOM.addEventListener("submit", handleProjectRiskEditSubmit);
