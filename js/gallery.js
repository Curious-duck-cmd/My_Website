


const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


const fileBtn = document.getElementById('fileBtn');
const imgPreview = document.getElementById('imgPreview');
const previewContainer = document.getElementById('previewContainer');
const uploadBtn = document.getElementById('uploadBtn');

// 1. Show preview when file is picked
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

// 2. Upload Logic
uploadBtn.onclick = async () => {
    const file = fileBtn.files[0];
    const user = document.getElementById('picUser').value || "Guest";
    const cap = document.getElementById('picCaption').value || "";

    if (!file) return alert("Select a file!");

    uploadBtn.innerText = "WORKING...";
    uploadBtn.disabled = true;

    // A. Upload file to Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: storageData, error: storageErr } = await _supabase.storage
        .from('chat-pics')
        .upload(fileName, file);

    if (storageErr) {
        alert("Upload Failed: " + storageErr.message);
        uploadBtn.disabled = false;
        return;
    }

    // B. Get the Public URL
    const { data: urlData } = _supabase.storage.from('chat-pics').getPublicUrl(fileName);

    // C. Save info to Gallery Table
    await _supabase.from('gallery').insert([
        { username: user, image_url: urlData.publicUrl, caption: cap }
    ]);

    location.reload(); 
};

// 3. Load Gallery
async function loadGallery() {
    const { data } = await _supabase.from('gallery').select('*').order('created_at', { ascending: false });
    const grid = document.getElementById('imageGrid');
    
    // Simple CSS for the grid via JS
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 1fr))";
    grid.style.gap = "15px";

    data.forEach(item => {
        const card = document.createElement('div');
        card.style = "border:2px solid #000; padding:5px; background:#fff; box-shadow:3px 3px 0 #000;";
        card.innerHTML = `
            <img src="${item.image_url}" style="width:100%; border:1px solid #000;">
            <p style="font-size:12px; margin-top:5px;"><b>${item.username}:</b> ${item.caption}</p>
        `;
        grid.appendChild(card);
    });
}

loadGallery();