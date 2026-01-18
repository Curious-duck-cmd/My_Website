// Ensure this file is loaded as type="module"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Elements
const loginOverlay = document.getElementById('loginOverlay');
const passInput = document.getElementById('passInput');
const unlockBtn = document.getElementById('unlockBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.getElementById('closeBtn');

// 3. Popup Controls
function openLogin() {
    loginOverlay.style.display = 'flex';
    passInput.focus();
}

function closeLogin() {
    loginOverlay.style.display = 'none';
    passInput.value = '';
}

// 4. Secure Validation Logic
async function checkPassword() {
    const email = "admin1@gmail.com"; // MUST be the email you registered in Supabase
    const password = passInput.value;

    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Server-side check
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Incorrect password!");
        passInput.value = '';
    } else {
        // Success
        window.location.href = "/html/logged.html";
    }
}

// --- EVENT LISTENERS ---

// Click listeners for the buttons inside the popup
unlockBtn.addEventListener('click', checkPassword);
cancelBtn.addEventListener('click', closeLogin);
closeBtn.addEventListener('click', closeLogin);

// Key listeners (Enter and Escape)
window.addEventListener('keydown', (e) => {
    if (loginOverlay.style.display === 'flex') {
        if (e.key === 'Enter') checkPassword();
        if (e.key === 'Escape') closeLogin();
    }
});

// Footer Link Listener - This makes the "Logged" link open the popup
// Note: Make sure your footer link looks like: <a href="logged.html">...</a>
const footerLink = document.querySelector('footer a[href="logged.html"]') || 
                   document.querySelector('footer a[href="/html/logged.html"]');

if (footerLink) {
    footerLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        openLogin();
    });
}
// Add this to the bottom of your index.js
const loginLink = document.querySelector('footer a'); // Targets the "LOGIN ?" link
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLogin();
    });
}