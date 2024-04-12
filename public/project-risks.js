import {
  fetchDashboardData,
  displayDashboardData,
  API_BASE_ROUTE,
  dashboardId,
} from "./dashboard.js";

const projectRisksDOM = document.querySelector(".project__project-risks");
const projectRiskModalDOM = document.querySelector("#edit-project-risk-modal");
const projectRiskFormDOM = document.querySelector(".edit-modal__form");
const projectRiskIdDOM = document.querySelector("#project-risk-id");
const projectRiskTitleDOM = document.querySelector("#project-risk-name");
const projectRiskDescriptionDOM = document.querySelector("#project-risk-description");
const projectRiskStatusLowDOM = document.querySelector("#project-risk-status-low");
const projectRiskStatusModerateDOM = document.querySelector("#project-risk-status-moderate");
const projectRiskStatusHighDOM = document.querySelector("#project-risk-status-high");

const addProjectRiskModalDOM = document.querySelector("#add-project-risk-modal");
const addProjectRiskFormDOM = document.querySelector("#add-project-risk-form");
const addProjectRiskTitleDOM = document.querySelector("#add-project-risk-name");
const addProjectRiskDescriptionDOM = document.querySelector("#add-project-risk-description");
const addProjectRiskStatusLowDOM = document.querySelector("#add-project-risk-status-low");
const addProjectRiskStatusModerateDOM = document.querySelector("#add-project-risk-status-moderate");
const addProjectRiskStatusHighDOM = document.querySelector("#add-project-risk-status-high");
const addProjectRiskBtn = document.querySelector("#add-project-risk-btn");
const addProjectRiskCloseBtn = document.querySelector(".add-project-risk-close-btn");

const editProjectRiskCloseBtn = document.querySelector(".edit-project-risk-close-btn");
const editProjectRiskModalDOM = document.querySelector("#edit-project-risk-modal");

let projectRiskId = "";

// CREATE
async function handleAddProjectRiskFormSubmit() {
  // make a new project risk obj

  const newProjectRisk = {
    title: addProjectRiskTitleDOM.value,
    description: addProjectRiskDescriptionDOM.value,
  };

  if (addProjectRiskStatusLowDOM.checked) {
    newProjectRisk.status = "Low";
    if (document.querySelector(".project__section-card-status")) {
      document.querySelector(".project__section-card-status").dataset.status = "low";
    }
  } else if (addProjectRiskStatusModerateDOM.checked) {
    newProjectRisk.status = "Moderate";
    if (document.querySelector(".project__section-card-status")) {
      document.querySelector(".project__section-card-status").dataset.status = "moderate";
    }
  } else if (addProjectRiskStatusHighDOM.checked) {
    newProjectRisk.status = "High";
    if (document.querySelector(".project__section-card-status")) {
      document.querySelector(".project__section-card-status").dataset.status = "high";
    }
  }
  // make a POST request

  const token = localStorage.getItem("token");
  try {
    await axios.post(`${API_BASE_ROUTE}/dashboard/${dashboardId}/project-risks`, newProjectRisk, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error.response);
  }
  // re-render project risks
  await displayDashboardData();
}

// READ
export function fetchProjectRisks(data) {
  projectRisksDOM.innerHTML = "";
  for (const item of data.dashboards[0].projectRisks) {
    const projectRiskListElement = document.createElement("li");
    projectRiskListElement.classList.add("project__section-card");
    projectRiskListElement.dataset.id = item._id;
    projectRiskListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<span class="project__section-card-status | text-sm"
                                    data-status=${item.status.toLowerCase()}>${item.status}</span>`,
      `<div class="flex items-center gap-4">
                                    <i class="project-risk-edit-btn | cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="project-risk-delete-btn | cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      ` <p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectRisksDOM.append(projectRiskListElement);
  }

  // grab edit buttons after they've been created, if you grab them at the top of the code they won't havent been created yet, thus getting 'null'
  const editRiskBtns = document.querySelectorAll(".project-risk-edit-btn");
  editRiskBtns.forEach((button) => {
    button.addEventListener("click", handleEditRiskClick);
  });

  const projectRiskDeleteBtns = document.querySelectorAll(".project-risk-delete-btn");
  projectRiskDeleteBtns.forEach((button) => {
    button.addEventListener("click", handleDeleteProjectRiskClick);
  });
}

// UPDATE
async function handleEditRiskClick(e) {
  projectRiskModalDOM.showModal();

  const clickedElement = e.target;
  const projectRiskElement = clickedElement.closest(".project__section-card");

  if (projectRiskElement) {
    projectRiskId = projectRiskElement.dataset.id;

    try {
      const data = await fetchDashboardData();

      for (const risk of data.dashboards[0].projectRisks) {
        if (risk._id === projectRiskId) {
          let { _id: riskID, title, description, status } = risk;

          projectRiskIdDOM.textContent = `${riskID}`;
          projectRiskTitleDOM.value = title;
          projectRiskDescriptionDOM.value = description;

          switch (status) {
            case "Low":
              projectRiskStatusLowDOM.checked = true;
              break;
            case "Moderate":
              projectRiskStatusModerateDOM.checked = true;
              break;
            case "High":
              projectRiskStatusHighDOM.checked = true;
              break;
          }
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  }
}

async function handleProjectRiskFormSubmit() {
  const token = localStorage.getItem("token");

  const newProjectRisk = {
    title: projectRiskTitleDOM.value,
    description: projectRiskDescriptionDOM.value,
  };

  if (projectRiskStatusLowDOM.checked) {
    newProjectRisk.status = "Low";
    document.querySelector(".project__section-card-status").dataset.status = "low";
  } else if (projectRiskStatusModerateDOM.checked) {
    newProjectRisk.status = "Moderate";
    document.querySelector(".project__section-card-status").dataset.status = "moderate";
  } else if (projectRiskStatusHighDOM.checked) {
    newProjectRisk.status = "High";
    document.querySelector(".project__section-card-status").dataset.status = "high";
  }

  try {
    await axios.patch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/project-risks/${projectRiskId}`,
      newProjectRisk,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await displayDashboardData();
  } catch (error) {
    console.log(error.response);
  }
}

// DELETE
async function handleDeleteProjectRiskClick(e) {
  const projectRiskElement = e.target.closest(".project__section-card");
  const projectRiskId = projectRiskElement.dataset.id;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/project-risks/${projectRiskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error.response);
  }

  await displayDashboardData();
}

addProjectRiskBtn.addEventListener("click", () => {
  addProjectRiskModalDOM.showModal();
});
addProjectRiskFormDOM.addEventListener("submit", handleAddProjectRiskFormSubmit);
projectRiskFormDOM.addEventListener("submit", handleProjectRiskFormSubmit);
editProjectRiskCloseBtn.addEventListener("click", () => {
  editProjectRiskModalDOM.close();
});
addProjectRiskCloseBtn.addEventListener("click", () => {
  addProjectRiskModalDOM.close();
});
