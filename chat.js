// 1. REPLACE THESE WITH YOUR ACTUAL KEYS FROM SETTINGS
const SUPABASE_URL = 'https://bcdadmarkuzavlcwjjhs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5qpRTrEY01_irr2ImlcONw_WEqaupbX';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const chatDisplay = document.getElementById('chatDisplay');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

// 2. Load old messages when you open the page
async function loadMessages() {
    const { data, error } = await _supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

    if (data) {
        chatDisplay.innerHTML = ''; // Clear "Welcome" text
        data.forEach(msg => appendMessage(msg));
    }
}

// 3. Put a message on the screen
function appendMessage(msg) {
    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'msg-bubble'; 
    // This matches your monospace / window style
    div.innerHTML = `<small style="opacity:0.5;">[${time}]</small> <b>${msg.username}:</b> ${msg.content}`;
    chatDisplay.appendChild(div);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// 4. Send a new message
async function postMessage() {
    const user = usernameInput.value.trim() || "Guest";
    const text = messageInput.value.trim();

    if (text !== "") {
        const { error } = await _supabase
            .from('messages')
            .insert([{ username: user, content: text }]);
        
        if (!error) messageInput.value = "";
    }
}

// 5. LISTEN FOR NEW MESSAGES (REALTIME)
_supabase
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        appendMessage(payload.new);
    })
    .subscribe();

// Events
sendBtn.addEventListener('click', postMessage);
messageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') postMessage(); });

loadMessages();