import { API_BASE_ROUTE, dashboardId, displayDashboardData } from "./dashboard.js";

const projectTeamMembersDOM = document.querySelector(".project__sidebar-members");
const projectTeamMemberAddBtn = document.querySelector(".project__sidebar-members-submit");
const projectTeamMemberModalDOM = document.querySelector("#add-project-team-member-modal");
const projectTeamMemberFormDOM = document.querySelector("#add-project-team-member-form");
const projectTeamMemberModalInputDOM = document.querySelector("#add-project-team-member-name");
const addProjectTeamMemberCloseBtn = document.querySelector(".add-project-team-member-close-btn");
const addProjectTeamMemberBtnMobile = document.querySelector("#add-team-members-btn-mobile");

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
async function handleAddTeamMemberFormSubmit() {
  const token = localStorage.getItem("token");

  const newTeamMember = {
    name: projectTeamMemberModalInputDOM.value,
  };
  try {
    const response = await fetch(`${API_BASE_ROUTE}/dashboard/${dashboardId}/team-members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTeamMember),
    });

    if (!response.ok) {
      return;
    }

    alertSuccess("Team member added.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }

  await displayDashboardData();
}

// READ
export function fetchTeamMembers(data) {
  projectTeamMembersDOM.innerHTML = "";
  for (const item of data.dashboards[0].teamMembers) {
    const teamMembersListElement = document.createElement("li");
    teamMembersListElement.classList.add("project__sidebar-members-item");
    teamMembersListElement.dataset.id = item._id;
    teamMembersListElement.innerHTML = [
      `<input class="team-member-input | b-0 bg-transparent w-1/2 outline-0" type="text" value="${item.name}" disabled>`,
      `<div class="flex items-center gap-4">
                                    <i class="team-member-edit-btn | cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="team-member-delete-btn | cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</li>`,
    ].join("");
    projectTeamMembersDOM.append(teamMembersListElement);
  }
  const editTeamMembersBtns = document.querySelectorAll(".team-member-edit-btn");
  editTeamMembersBtns.forEach((button) => {
    button.addEventListener("click", handleEditTeamMemberClick);
  });

  const teamMemberDeleteBtns = document.querySelectorAll(".team-member-delete-btn");
  teamMemberDeleteBtns.forEach((button) => {
    button.addEventListener("click", handleDeleteTeamMemberClick);
  });
}

// UPDATE
async function handleEditTeamMemberClick(e) {
  const teamMemberInput = e.target.closest(".project__sidebar-members-item").querySelector("input"); // get the input of the team member list element of the clicked edit button

  if (teamMemberInput) {
    teamMemberInput.disabled = false;
    teamMemberInput.focus();
    teamMemberInput.selectionStart = teamMemberInput.value.length;
    teamMemberInput.scrollLeft = teamMemberInput.scrollWidth; // scroll to the end of input, so when focusing long names, users can see the end

    teamMemberInput.addEventListener("change", async (e) => {
      const token = localStorage.getItem("token");
      const teamMemberId = e.target.closest(".project__sidebar-members-item").dataset.id;
      try {
        const response = await fetch(
          `${API_BASE_ROUTE}/dashboard/${dashboardId}/team-members/${teamMemberId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: teamMemberInput.value,
            }),
          }
        );

        if (!response.ok) {
          return;
        }

        alertSuccess("Team Member updated.");
      } catch (error) {
        console.log(error);
        alertError("Error has occured");
      }
    });
  }
}

// DELETE
async function handleDeleteTeamMemberClick(e) {
  const teamMemberElement = e.target.closest(".project__sidebar-members-item");
  const teamMemberId = teamMemberElement.dataset.id;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/team-members/${teamMemberId}`,
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

    alertSuccess("Team Member deleted.");
  } catch (error) {
    console.log(error);
    alertError("Error has occured");
  }

  await displayDashboardData();
}

// Event listeners
projectTeamMemberAddBtn.addEventListener("click", () => {
  projectTeamMemberModalDOM.showModal();
});
addProjectTeamMemberBtnMobile.addEventListener("click", () => {
  projectTeamMemberModalDOM.showModal();
});
projectTeamMemberFormDOM.addEventListener("submit", handleAddTeamMemberFormSubmit);
addProjectTeamMemberCloseBtn.addEventListener("click", () => {
  projectTeamMemberModalDOM.close();
});
