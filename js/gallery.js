// 1. Initialize Supabase
// Using Vite's import.meta.env for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// The 'supabase' object comes from the CDN script in your HTML
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. DOM Elements
const fileBtn = document.getElementById('fileBtn');
const imgPreview = document.getElementById('imgPreview');
const previewContainer = document.getElementById('previewContainer');
const uploadBtn = document.getElementById('uploadBtn');
const grid = document.getElementById('imageGrid');

// --- SECTION A: UPLOAD LOGIC ---

// Handle file selection and preview
if (fileBtn) {
    fileBtn.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgPreview.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Handle the Upload Button Click
if (uploadBtn) {
    uploadBtn.onclick = async () => {
        const file = fileBtn.files[0];
        const user = document.getElementById('picUser').value || "Guest";
        const cap = document.getElementById('picCaption').value || "";

        if (!file) return alert("Please select a file first!");

        uploadBtn.innerText = "UPLOADING...";
        uploadBtn.disabled = true;

        try {
            // 1. Upload file to 'chat-pics' Storage Bucket
            const fileName = `${Date.now()}-${file.name}`;
            const { data: storageData, error: storageErr } = await _supabase.storage
                .from('chat-pics') 
                .upload(fileName, file);

            if (storageErr) throw storageErr;

            // 2. Get the Public URL for the image
            const { data: urlData } = _supabase.storage
                .from('chat-pics')
                .getPublicUrl(fileName);

            // 3. Insert record into 'gallery' Table
            const { error: insertErr } = await _supabase
                .from('gallery')
                .insert([
                    { 
                        username: user, 
                        image_url: urlData.publicUrl, 
                        caption: cap 
                    }
                ]);

            if (insertErr) throw insertErr;

            alert("Post Successful!");
            location.reload(); 

        } catch (err) {
            console.error("FULL ERROR LOG:", err);
            alert("Process Failed: " + err.message);
            uploadBtn.innerText = "UPLOAD";
            uploadBtn.disabled = false;
        }
    };
}

// --- SECTION B: FETCH/VIEW LOGIC ---

async function fetchGallery() {
    if (!grid) return;

    const { data, error } = await _supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch Error:", error.message);
        grid.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
        return;
    }

    if (data && data.length > 0) {
        grid.innerHTML = ""; 
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = "gallery-item"; 
            card.innerHTML = `
                <img src="${item.image_url}" alt="Post" onerror="this.src='https://placehold.co/400?text=Error+Loading+Image'">
                <div class="gallery-info">
                    <span class="gallery-user">@${item.username}</span>
                    <p style="margin: 0;">${item.caption || ""}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    } else {
        grid.innerHTML = "<p>No posts yet. Be the first!</p>";
    }
}

// Run fetch on load
fetchGallery();