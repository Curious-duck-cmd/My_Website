const loginOverlay = document.getElementById('loginOverlay');
const passInput = document.getElementById('passInput');
const unlockBtn = document.getElementById('unlockBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.getElementById('closeBtn');

// Open the popup
function openLogin() {
    loginOverlay.style.display = 'flex';
    passInput.focus(); // Automatically focus the box so you can start typing
}

// Close the popup
function closeLogin() {
    loginOverlay.style.display = 'none';
    passInput.value = '';
}

// Validation logic
function checkPassword() {
    const secret = "Hollow grub"; // Change this to your password
    if (passInput.value === secret) {
        window.location.href = "logged.html";
    } else {
        alert("Incorrect password!");
        passInput.value = '';
    }
}

// --- EVENT LISTENERS ---

// 1. Click listeners
unlockBtn.addEventListener('click', checkPassword);
cancelBtn.addEventListener('click', closeLogin);
closeBtn.addEventListener('click', closeLogin);

// 2. The "Enter" Key Fix
// We listen to the whole window, but only act if the login is visible
window.addEventListener('keydown', (e) => {
    if (loginOverlay.style.display === 'flex') {
        if (e.key === 'Enter') {
            checkPassword();
        }
        if (e.key === 'Escape') {
            closeLogin();
        }
    }
});

// 3. Link listener (Targets the footer link)
document.querySelector('footer a[href="logged.html"]').addEventListener('click', (e) => {
    e.preventDefault(); // Stop it from going to the page immediately
    openLogin();
});