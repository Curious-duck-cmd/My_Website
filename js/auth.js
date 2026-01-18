// Ensure Supabase is initialized (using your keys from gallery.js/chat.js)
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    const emailInput = document.getElementById('authEmail');
    const passInput = document.getElementById('authPass');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInBtn = document.getElementById('signInBtn');

    // --- SIGN UP LOGIC ---
 signUpBtn.onclick = async () => {
    // .trim() removes any accidental spaces at the start or end
    const email = emailInput.value.trim(); 
    const password = passInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Signup successful!");
    }
};
    // --- SIGN IN LOGIC ---
    signInBtn.onclick = async () => {
        const email = emailInput.value;
        const password = passInput.value;

        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            // Redirect back to chat or dashboard
            window.location.href = "chat.html"; 
        }
    };
});