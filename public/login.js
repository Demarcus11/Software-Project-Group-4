const usernameInputDOM = document.querySelector(".login__username");
const passwordInputDOM = document.querySelector(".login__password");
const formDOM = document.querySelector(".login__form");

localStorage.removeItem("username");
localStorage.removeItem("token");

const login = async (e) => {
  e.preventDefault();

  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;

  try {
    const { data } = await axios.post("/api/v1/auth/login", { username, password });

    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);

    window.location.href = "/dashboard.html";
  } catch (error) {
    console.log(error.response.data.msg);
    localStorage.removeItem("token", data.token);
  }
};

// Event Listeners
formDOM.addEventListener("submit", login);
