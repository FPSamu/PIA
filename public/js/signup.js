import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { auth } from "./firebase.js";

const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const username = signupForm['signup-name'].value;
    const password = signupForm['signup-password'].value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        signupForm.reset();

        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username })
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        } else {
            const result = await response.json();
            alert(result.message || "Hubo un problema al registrarse.");
        }
        
        window.location.href = "index.html"; 
    } catch (error) {
        console.log(error);

        switch (error.code) {
            case 'auth/invalid-email':
                alert("Correo inválido. Por favor, introduce un correo electrónico válido.");
                break;
            case 'auth/weak-password':
                alert("La contraseña debe tener una longitud mínima de 6 caracteres.");
                break;
            case 'auth/email-already-in-use':
                alert("El correo ya está en uso. Por favor, utiliza otro correo.");
                break;
            case 'auth/operation-not-allowed':
                alert("El registro de cuentas está deshabilitado. Contacta al soporte.");
                break;
            default:
                alert("Algo salió mal. Por favor, inténtalo de nuevo más tarde.");
                break;
        }
    }
});
