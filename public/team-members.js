import { dashboardId } from "./dashboard.js";

const projectTeamMembersDOM = document.querySelector(".project__sidebar-members");

// CREATE

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
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</li>`,
    ].join("");
    projectTeamMembersDOM.append(teamMembersListElement);
  }
}

// UPDATE
const editBtnsDOM = document.querySelectorAll(".team-member-edit-btn");
editBtnsDOM.forEach((editBtn) => {
  editBtn.addEventListener("click", () => {
    const teamMemberInput = editBtn.parentElement.previousElementSibling; // the input is a sibling of the parent div that holds the edit btn
    if (teamMemberInput) {
      teamMemberInput.disabled = false;
      teamMemberInput.focus();
      teamMemberInput.selectionStart = teamMemberInput.value.length;
      teamMemberInput.scrollLeft = teamMemberInput.scrollWidth; // scroll to the end of input, so when focusing long names, users can see the end

      teamMemberInput.addEventListener("change", async (e) => {
        const token = localStorage.getItem("token");
        const teamMemberId = e.target.closest(".project__sidebar-members-item").dataset.id;
        try {
          await axios.patch(
            `${API_BASE_ROUTE}/dashboard/${dashboardId}/team-members/${teamMemberId}`,
            {
              name: teamMemberInput.value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log(error.response);
        }
      });
    }
  });
});

// DELETE
