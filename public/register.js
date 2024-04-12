const usernameInputDOM = document.querySelector("#register__username");
const passwordInputDOM = document.querySelector("#register__password");
const registerFormDOM = document.querySelector("#register__form");

const API_BASE_ROUTE = "/api/v1";

localStorage.removeItem("username");
localStorage.removeItem("token");

async function createDefaultDashboard() {
  try {
  } catch (error) {
    console.log(error.response);
  }
}

async function handleRegisterFormSubmit(e) {
  e.preventDefault();

  const register = {
    username: usernameInputDOM.value,
    password: passwordInputDOM.value,
  };

  try {
    const { data } = await axios.post(`${API_BASE_ROUTE}/auth/register`, register);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);

    await createDefaultDashboard();
    window.location.href = "/dashboard.html";
  } catch (error) {
    console.log(error.response);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  }
}

// Event Listeners
registerFormDOM.addEventListener("submit", handleRegisterFormSubmit);
