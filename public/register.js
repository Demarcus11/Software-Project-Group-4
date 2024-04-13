const usernameInputDOM = document.querySelector("#register__username");
const passwordInputDOM = document.querySelector("#register__password");
const registerFormDOM = document.querySelector("#register__form");

const API_BASE_ROUTE = "/api/v1";

localStorage.removeItem("username");
localStorage.removeItem("token");

async function createDefaultDashboard() {
  try {
  } catch (error) {
    console.log(error);
  }
}

async function handleRegisterFormSubmit(e) {
  e.preventDefault();

  const register = {
    username: usernameInputDOM.value,
    password: passwordInputDOM.value,
  };

  try {
    const response = await fetch(`${API_BASE_ROUTE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(register),
    });

    if (!response.ok) {
      return;
    }
    const data = await response.json();
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);

    await createDefaultDashboard();
    window.location.href = "/dashboard.html";
  } catch (error) {
    console.log(error);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  }
}

// Event Listeners
registerFormDOM.addEventListener("submit", handleRegisterFormSubmit);
