const chatDisplay = document.getElementById('chatDisplay');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

function postMessage() {
    const user = usernameInput.value.trim() || "Guest";
    const msg = messageInput.value.trim();

    if (msg !== "") {
        const newMsg = document.createElement('div');
        newMsg.className = 'msg-bubble';
        
        // Adding a timestamp makes it look "nicer" and more professional
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        newMsg.innerHTML = `<small style="opacity:0.5; font-size:0.8rem;">${time}</small><br><b>${user}</b> ${msg}`;
        
        chatDisplay.appendChild(newMsg);
        
        // Smoother scroll to bottom
        chatDisplay.scrollTo({
            top: chatDisplay.scrollHeight,
            behavior: 'smooth'
        });
        
        messageInput.value = "";
    }
}

sendBtn.addEventListener('click', postMessage);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') postMessage();
});