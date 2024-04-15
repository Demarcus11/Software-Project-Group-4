const usernameInputDOM = document.querySelector(".login__username");
const passwordInputDOM = document.querySelector(".login__password");
const formDOM = document.querySelector(".login__form");
const loginErrorDOM = document.querySelector(".login-error");

localStorage.removeItem("username");
localStorage.removeItem("token");

const login = async (e) => {
  e.preventDefault();

  const login = {
    username: usernameInputDOM.value,
    password: passwordInputDOM.value,
  };

  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.msg;
      loginErrorDOM.textContent = errorMessage;
      document.querySelector(".error-box").style.display = "flex";
      return;
    }

    const data = await response.json();

    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);

    window.location.href = "/dashboard.html";
  } catch (error) {
    console.log(error);
    localStorage.removeItem("token");
  }
};

// Event Listeners
formDOM.addEventListener("submit", login);
