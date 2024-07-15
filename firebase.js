// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuB1am-VpLKrx5y0fQnWly6I8do8hH3_g",
    authDomain: "website-database-7929c.firebaseapp.com",
    databaseURL: "https://website-database-7929c-default-rtdb.firebaseio.com",
    projectId: "website-database-7929c",
    storageBucket: "website-database-7929c.appspot.com",
    messagingSenderId: "126419504544",
    appId: "1:126419504544:web:13bd623eb28bff5fa5a8c5",
    measurementId: "G-8B717N622Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Show message function
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const db = getFirestore();

    // Register user
    const signupButton = document.getElementById('submitsignup');
    if (signupButton) {
        signupButton.addEventListener('click', (event) => {
            event.preventDefault();
            const username = document.getElementById('uname1').value;
            const email = document.getElementById('email1').value;
            const password1 = document.getElementById('upswd1').value;
            const password2 = document.getElementById('upswd2').value;

            if (password1 !== password2) {
                showMessage('Passwords do not match!', 'signupmessage');
                return;
            }

            createUserWithEmailAndPassword(auth, email, password1)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userData = { username, email };
                    showMessage('Account Created Successfully', 'signupmessage');
                    const docRef = doc(db, "users", user.uid);
                    setDoc(docRef, userData)
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch((error) => {
                            console.error("Error writing document", error);
                        });
                })
                .catch((error) => {
                    const errorcode = error.code;
                    if (errorcode === 'auth/email-already-in-use') {
                        showMessage('Email Address Already Exists !!!', 'signupmessage');
                    } else {
                        showMessage('Unable to create user', 'signupmessage');
                    }
                });
        });
    }

    // Login user
    document.addEventListener('DOMContentLoaded', () => {
        const auth = getAuth();
    
        const loginButton = document.getElementById('submitlogin');
        if (loginButton) {
            loginButton.addEventListener('click', (event) => {
                event.preventDefault();
                const email = document.getElementById('uname').value;
                const password = document.getElementById('upswd').value;
    
                // Input validation
                if (!email || !password) {
                    showMessage('Email and Password cannot be empty!', 'signinmessage');
                    return;
                }
    
                // Log inputs for debugging
                console.log("Email:", email);
                console.log("Password:", password);
    
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        showMessage('Login Successful', 'signinmessage');
                        window.location.href = 'index.html';
                        console.log("login");
                    })
                    .catch((error) => {
                        console.error("Error during login:", error); // Log detailed error
                        const errorCode = error.code;
                        switch (errorCode) {
                            case 'auth/wrong-password':
                            case 'auth/user-not-found':
                                showMessage('Invalid Email or Password', 'signinmessage');
                                break;
                            case 'auth/invalid-email':
                                showMessage('Invalid Email Address!', 'signinmessage');
                                break;
                            case 'auth/user-disabled':
                                showMessage('User account has been disabled', 'signinmessage');
                                break;
                            default:
                                showMessage('Unable to login: ' + error.message, 'signinmessage');
                        }
                    });
            });
        }
    });
});    
