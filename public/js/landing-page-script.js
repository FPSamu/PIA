const signupButtons = document.querySelectorAll(".go-to-signup");

signupButtons.forEach(button => {
    button.addEventListener("click", () => {
        window.location.href = "signup.html";
    });
});

const loginButtons = document.querySelectorAll(".go-to-login");

loginButtons.forEach(button => {
    button.addEventListener("click", () => {
        window.location.href = "login.html";
    });
});