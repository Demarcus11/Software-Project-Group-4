const projectNonFunctionReqsDOM = document.querySelector(".project__project-non-functional-reqs");

// CREATE

// READ
export function fetchNonFunctionalReqs(data) {
  projectNonFunctionReqsDOM.innerHTML = "";
  for (const item of data.dashboards[0].nonFunctionalRequirements) {
    const nonFunctionalReqsListElement = document.createElement("li");
    nonFunctionalReqsListElement.classList.add("project__section-card");
    nonFunctionalReqsListElement.innerHTML = [
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
    projectNonFunctionReqsDOM.append(nonFunctionalReqsListElement);
  }
}

// UPDATE

// DELETE
