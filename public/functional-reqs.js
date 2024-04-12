import {
  fetchDashboardData,
  dashboardId,
  API_BASE_ROUTE,
  displayDashboardData,
} from "./dashboard.js";

const projectFunctionalReqsDOM = document.querySelector(".project__project-functional-reqs");
const projectFunctionalReqModalDOM = document.querySelector("#edit-project-functional-req-modal");
const projectFunctionalReqFormDOM = document.querySelector("#edit-modal__form-functinal-req");
const projectFunctionalReqIdDOM = document.querySelector("#project-functional-req-id");
const projectFunctionalReqTitleDOM = document.querySelector("#project-functional-req-name");
const projectFunctionalReqDescriptionDOM = document.querySelector(
  "#project-functional-req-description"
);

const addFunctionalReqModalDOM = document.querySelector("#add-project-functional-req-modal");
const addFunctionalReqFormDOM = document.querySelector("#add-modal__form-functinal-req");
const addFunctionalReqTitleDOM = document.querySelector("#add-project-functional-req-name");
const addFunctionalReqDescriptionDOM = document.querySelector(
  "#add-project-functional-req-description"
);
const addFunctionalReqBtn = document.querySelector("#add-functional-req-btn");

let projectFunctionalReqId = "";

// CREATE
async function handleAddFunctionalReqFormSubmit() {
  // make a new project risk obj

  const newFunctionalReq = {
    title: addFunctionalReqTitleDOM.value,
    description: addFunctionalReqDescriptionDOM.value,
  };

  // make a POST request

  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/functional-requirements`,
      newFunctionalReq,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error.response);
  }
  // re-render project risks
  await displayDashboardData();
}

// READ
export function fetchFunctionalReqs(data) {
  projectFunctionalReqsDOM.innerHTML = "";
  for (const item of data.dashboards[0].functionalRequirements) {
    const projectFunctionalReqsListElement = document.createElement("li");
    projectFunctionalReqsListElement.classList.add("project__section-card");
    projectFunctionalReqsListElement.dataset.id = item._id;
    projectFunctionalReqsListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<div class="flex items-center gap-4">
                                    <i class="project-functional-req-edit-btn | cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="functional-req-delete-btn | cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectFunctionalReqsDOM.append(projectFunctionalReqsListElement);

    const editFunctionalReqBtns = document.querySelectorAll(".project-functional-req-edit-btn");
    editFunctionalReqBtns.forEach((button) => {
      button.addEventListener("click", handleEditFunctionalReqClick);
    });

    const functionalReqDeleteBtns = document.querySelectorAll(".functional-req-delete-btn");
    functionalReqDeleteBtns.forEach((button) => {
      button.addEventListener("click", handleDeleteFunctionalReqClick);
    });
  }
}

// UPDATE
async function handleEditFunctionalReqClick(e) {
  projectFunctionalReqModalDOM.showModal();

  const clickedElement = e.target;
  const projectFunctionalReqElement = clickedElement.closest(".project__section-card");

  if (projectFunctionalReqElement) {
    projectFunctionalReqId = projectFunctionalReqElement.dataset.id;

    try {
      const data = await fetchDashboardData();

      for (const req of data.dashboards[0].functionalRequirements) {
        if (req._id === projectFunctionalReqId) {
          let { _id: reqID, title, description } = req;

          projectFunctionalReqIdDOM.textContent = `${reqID}`;
          projectFunctionalReqTitleDOM.value = title;
          projectFunctionalReqDescriptionDOM.value = description;
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  }
}

async function handleProjectFunctionalReqFormSubmit() {
  const token = localStorage.getItem("token");

  const newProjectFunctionalReq = {
    title: projectFunctionalReqTitleDOM.value,
    description: projectFunctionalReqDescriptionDOM.value,
  };

  try {
    await axios.patch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/functional-requirements/${projectFunctionalReqId}`,
      newProjectFunctionalReq,
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
async function handleDeleteFunctionalReqClick(e) {
  const functionalReqElement = e.target.closest(".project__section-card");
  const functionalReqId = functionalReqElement.dataset.id;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/functional-requirements/${functionalReqId}`,
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

projectFunctionalReqFormDOM.addEventListener("submit", handleProjectFunctionalReqFormSubmit);
addFunctionalReqBtn.addEventListener("click", () => {
  addFunctionalReqModalDOM.showModal();
});
addFunctionalReqFormDOM.addEventListener("submit", handleAddFunctionalReqFormSubmit);
