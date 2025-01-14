import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyA5IiAtbxTpvUEzLfGSvA3CvigPWvXPSn0",
    authDomain: "pia-app-bef19.firebaseapp.com",
    projectId: "pia-app-bef19",
    storageBucket: "pia-app-bef19.firebasestorage.app",
    messagingSenderId: "484403700133",
    appId: "1:484403700133:web:fc7e9780891ca32ad0c84c",
    measurementId: "G-R2V8B7J5PB"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)