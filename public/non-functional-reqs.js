import {
  fetchDashboardData,
  dashboardId,
  API_BASE_ROUTE,
  displayDashboardData,
} from "./dashboard.js";

const projectNonFunctionReqsDOM = document.querySelector(".project__project-non-functional-reqs");
const projectNonFunctionalReqModalDOM = document.querySelector(
  "#edit-project-non-functional-req-modal"
);
const projectNonFunctionalReqFormDOM = document.querySelector(
  "#edit-modal__form-non-functinal-req"
);
const projectNonFunctionalReqIdDOM = document.querySelector("#project-non-functional-req-id");
const projectNonFunctionalReqTitleDOM = document.querySelector("#project-non-functional-req-name");
const projectNonFunctionalReqDescriptionDOM = document.querySelector(
  "#project-non-functional-req-description"
);

const addNonFunctionalReqModalDOM = document.querySelector("#add-project-non-functional-req-modal");
const addNonFunctionalReqFormDOM = document.querySelector("#add-modal__form-non-functinal-req");
const addNonFunctionalReqTitleDOM = document.querySelector("#add-project-non-functional-req-name");
const addNonFunctionalReqDescriptionDOM = document.querySelector(
  "#add-project-non-functional-req-description"
);
const addNonFunctionalReqBtn = document.querySelector("#add-non-functional-req-btn");
const editNonFunctionalReqCloseBtn = document.querySelector(
  ".edit-project-non-functional-close-btn"
);
const editNonFunctionalReqModal = document.querySelector("#edit-project-non-functional-req-modal");
const addNonFunctionalReqCloseBtn = document.querySelector(".add-project-non-functional-close-btn");
const addNonFunctionalReqModal = document.querySelector("#add-project-non-functional-req-modal");

let projectNonFunctionalReqId = "";

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

// CREATE
async function handleAddNonFunctionalReqFormSubmit() {
  // make a new project risk obj

  const newNonFunctionalReq = {
    title: addNonFunctionalReqTitleDOM.value,
    description: addNonFunctionalReqDescriptionDOM.value,
  };

  // make a POST request

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/non-functional-requirements`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNonFunctionalReq),
      }
    );

    if (!response.ok) {
      return;
    }
    alertSuccess("Non-Functional requirement added.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }

  // re-render project risks
  await displayDashboardData();
}

// READ
export function fetchNonFunctionalReqs(data) {
  projectNonFunctionReqsDOM.innerHTML = "";
  for (const item of data.dashboards[0].nonFunctionalRequirements) {
    const nonFunctionalReqsListElement = document.createElement("li");
    nonFunctionalReqsListElement.classList.add("project__section-card");
    nonFunctionalReqsListElement.dataset.id = item._id;
    nonFunctionalReqsListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<div class="flex items-center gap-4">
                                    <i class="project-non-functional-req-edit-btn | cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="non-functional-req-delete-btn | cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectNonFunctionReqsDOM.append(nonFunctionalReqsListElement);

    const editNonFunctionalReqBtns = document.querySelectorAll(
      ".project-non-functional-req-edit-btn"
    );
    editNonFunctionalReqBtns.forEach((button) => {
      button.addEventListener("click", handleEditNonFunctionalReqClick);
    });

    const nonFunctionalReqDeleteBtns = document.querySelectorAll(".non-functional-req-delete-btn");
    nonFunctionalReqDeleteBtns.forEach((button) => {
      button.addEventListener("click", handleDeleteNonFunctionalReqClick);
    });
  }
}

// UPDATE
async function handleEditNonFunctionalReqClick(e) {
  projectNonFunctionalReqModalDOM.showModal();

  const clickedElement = e.target;
  const projectNonFunctionalReqElement = clickedElement.closest(".project__section-card");

  if (projectNonFunctionalReqElement) {
    projectNonFunctionalReqId = projectNonFunctionalReqElement.dataset.id;

    try {
      const data = await fetchDashboardData();

      for (const req of data.dashboards[0].nonFunctionalRequirements) {
        if (req._id === projectNonFunctionalReqId) {
          let { _id: reqID, title, description } = req;

          projectNonFunctionalReqIdDOM.textContent = `${reqID}`;
          projectNonFunctionalReqTitleDOM.value = title;
          projectNonFunctionalReqDescriptionDOM.value = description;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function handleProjectNonFunctionalReqFormSubmit() {
  const token = localStorage.getItem("token");

  const newProjectNonFunctionalReq = {
    title: projectNonFunctionalReqTitleDOM.value,
    description: projectNonFunctionalReqDescriptionDOM.value,
  };

  try {
    const response = await fetch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/non-functional-requirements/${projectNonFunctionalReqId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProjectNonFunctionalReq),
      }
    );

    if (!response.ok) {
      return;
    }

    alertSuccess("Non-Functional requirement updated.");
    await displayDashboardData();
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }
}

// DELETE
async function handleDeleteNonFunctionalReqClick(e) {
  const nonFunctionalReqElement = e.target.closest(".project__section-card");
  const nonFunctionalReqId = nonFunctionalReqElement.dataset.id;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/non-functional-requirements/${nonFunctionalReqId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return;
    }

    alertSuccess("Non-Functional requirement deleted.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }

  await displayDashboardData();
}

projectNonFunctionalReqFormDOM.addEventListener("submit", handleProjectNonFunctionalReqFormSubmit);
addNonFunctionalReqBtn.addEventListener("click", () => {
  addNonFunctionalReqModalDOM.showModal();
});
addNonFunctionalReqFormDOM.addEventListener("submit", handleAddNonFunctionalReqFormSubmit);
editNonFunctionalReqCloseBtn.addEventListener("click", () => {
  editNonFunctionalReqModal.close();
});
addNonFunctionalReqCloseBtn.addEventListener("click", () => {
  addNonFunctionalReqModal.close();
});
