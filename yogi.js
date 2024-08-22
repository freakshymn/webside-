import { database, ref, set, get, child } from './firebase.js';

// Helper function to convert an ArrayBuffer to a hex string
const bufferToHex = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
};

// Function to hash a password
const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
};

// Function to handle user registration
const handleRegister = async () => {
    const username = document.getElementById('uname1').value;
    const email = document.getElementById('email1').value;
    const password = document.getElementById('upswd1').value;
    const confirmPassword = document.getElementById('upswd2').value;
    const errorBox = document.getElementById('errorBox');
    
    if (password !== confirmPassword) {
        errorBox.innerText = "Passwords do not match!";
        errorBox.style.display = "block";
        return;
    }

    try {
        const hashedPassword = await hashPassword(password);
        await set(ref(database, 'users/' + username), {
            email: email,
            password: hashedPassword
        });
        window.location.href = 'index.html'; // Redirect to login page after registration
    } catch (error) {
        console.error("Error registering user: ", error);
        errorBox.innerText = "Error registering user!";
        errorBox.style.display = "block";
    }
};

// Function to handle user login
const handleLogin = async () => {
    const username = document.getElementById('uname').value;
    const password = document.getElementById('upswd').value;
    const errorBox = document.getElementById('errorBox');

    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${username}`));
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const hashedPassword = await hashPassword(password);

            if (hashedPassword === userData.password) {
                window.location.href = 'index.html'; // Redirect to index page after login
            } else {
                errorBox.innerText = "Incorrect password!";
                errorBox.style.display = "block";
            }
        } else {
            errorBox.innerText = "User does not exist!";
            errorBox.style.display = "block";
        }
    } catch (error) {
        console.error("Error logging in: ", error);
        errorBox.innerText = "Error logging in!";
        errorBox.style.display = "block";
    }
};

// Function to load navigation
const loadNav = () => {
    fetch('head.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const navContainer = document.getElementById('nav-container');
            if (!navContainer.innerHTML.trim()) {
                navContainer.innerHTML = data;

                // Add event listeners after loading the navigation
                const signupButton = document.getElementById('submitsignup');
                const loginButton = document.getElementById('submitlogin');

                if (signupButton) {
                    signupButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleRegister();
                    });
                }

                if (loginButton) {
                    loginButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleLogin();
                    });
                }
            }
        })
        .catch(error => console.error('Error loading head.html:', error));
};

// Function to extract YouTube video ID and return the embed URL
const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
};

// Function to retrieve YouTube links and display them
const youtube = async () => {
    try {
        const dbRef = ref(database);
        const youtubeSnapshot = await get(child(dbRef, 'youtubeLinks'));
        
        if (youtubeSnapshot.exists()) {
            const youtubeLinks = youtubeSnapshot.val();

            for (let linkKey in youtubeLinks) {
                if (youtubeLinks.hasOwnProperty(linkKey)) {
                    const link = youtubeLinks[linkKey];
                    const embedUrl = getYouTubeEmbedUrl(link);

                    if (embedUrl) {
                        const iframe = document.createElement('iframe');
                        iframe.src = embedUrl;
                        iframe.width = "560";
                        iframe.height = "315";
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        iframe.allowFullscreen = true;

                        document.querySelector('.yt').appendChild(iframe);
                    } else {
                        console.error(`Invalid YouTube link: ${link}`);
                    }
                }
            }
        } else {
            console.log("No YouTube links found.");
        }
    } catch (error) {
        console.log("Error retrieving YouTube links:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadNav();
    youtube();
});
