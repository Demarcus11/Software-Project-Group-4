const projectFunctionReqsDOM = document.querySelector(".project__project-functional-reqs");

// CREATE

// READ
export function fetchFunctionalReqs(data) {
  projectFunctionReqsDOM.innerHTML = "";
  for (const item of data.dashboards[0].functionalRequirements) {
    const projectFunctionReqsListElement = document.createElement("li");
    projectFunctionReqsListElement.classList.add("project__section-card");
    projectFunctionReqsListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<div class="flex items-center gap-4">
                                    <i class="cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectFunctionReqsDOM.append(projectFunctionReqsListElement);
  }
}

// UPDATE

// DELETE
