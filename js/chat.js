// 1. Initialize Supabase
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// DOM Elements
const chatDisplay = document.getElementById('chatDisplay');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

// Auth UI Elements
const userInfo = document.getElementById('user-info');
const guestView = document.getElementById('guest-view');
const userDisplayName = document.getElementById('user-display-name');

// Visibility Containers
const privateArea = document.getElementById('private-chat-area');
const guestPlaceholder = document.getElementById('guest-placeholder');

let currentUserName = "Guest";

/**
 * 2. Check Login Status
 * Toggles visibility between the locked screen and the chat
 */
async function checkUser() {
    const { data: { user } } = await _supabase.auth.getUser();

    if (user) {
        // User is LOGGED IN
        currentUserName = user.email.split('@')[0]; // Extract name from email
        
        // Show Chat, Hide Locked Screen
        if (privateArea) privateArea.style.display = 'flex';
        if (guestPlaceholder) guestPlaceholder.style.display = 'none';
        
        // Update Sidebar
        if (userInfo) userInfo.style.display = 'block';
        if (guestView) guestView.style.display = 'none';
        if (userDisplayName) userDisplayName.innerText = currentUserName;

        // Start loading data now that we are authorized
        loadMessages();
    } else {
        // User is GUEST
        if (privateArea) privateArea.style.display = 'none';
        if (guestPlaceholder) guestPlaceholder.style.display = 'flex';
        
        if (userInfo) userInfo.style.display = 'none';
        if (guestView) guestView.style.display = 'block';
    }
}

/**
 * 3. Load Message History
 */
async function loadMessages() {
    const { data, error } = await _supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Database Error:", error.message);
        return;
    }

    if (data) {
        chatDisplay.innerHTML = ''; // Clear loading/system text
        data.forEach(msg => appendMessage(msg));
    }
}

/**
 * 4. Add Message to UI
 */
function appendMessage(msg) {
    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'msg-bubble'; 
    div.innerHTML = `<small style="opacity:0.5;">[${time}]</small> <b>${msg.username}:</b> ${msg.content}`;
    chatDisplay.appendChild(div);
    
    // Auto-scroll to bottom
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

/**
 * 5. Send Message
 */
async function postMessage() {
    const text = messageInput.value.trim();

    if (text !== "" && currentUserName !== "Guest") {
        const { error } = await _supabase
            .from('messages')
            .insert([{ 
                username: currentUserName, 
                content: text 
            }]);
        
        if (!error) {
            messageInput.value = ""; // Clear input on success
        } else {
            alert("Error sending: " + error.message);
        }
    }
}

/**
 * 6. Realtime Subscription
 */
_supabase
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        appendMessage(payload.new);
    })
    .subscribe();

/**
 * 7. Logout Logic
 */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        await _supabase.auth.signOut();
        window.location.reload(); // Refresh to lock the chat again
    };
}

/**
 * 8. Initialization & Event Listeners
 */
if (sendBtn) sendBtn.onclick = postMessage;

if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') postMessage();
    });
}

// Run the auth check on page load
checkUser();