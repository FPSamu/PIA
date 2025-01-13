import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { auth } from "./firebase.js";

const signinForm = document.querySelector("#signin-form");

signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signinForm["signin-email"].value.trim();
    const password = signinForm["signin-password"].value;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        signinForm.reset();

        localStorage.setItem("signedInEmail", email);

        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend login error:", errorData.message || "Unknown error");
            alert("Error notifying the backend about the login.");
            return;
        }

        window.location.href = "index.html";
    } catch (error) {
        console.error("Error signing in:", error);

        switch (error.code) {
            case "auth/invalid-email":
                alert("Correo inválido. Por favor, introduce un correo válido.");
                break;
            case "auth/user-disabled":
                alert("La cuenta está deshabilitada. Contacta al soporte.");
                break;
            case "auth/user-not-found":
                alert("Usuario no encontrado. Por favor, verifica el correo.");
                break;
            case "auth/wrong-password":
                alert("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
                break;
            default:
                alert("Algo salió mal. Por favor, inténtalo de nuevo más tarde.");
                break;
        }
    }
});
