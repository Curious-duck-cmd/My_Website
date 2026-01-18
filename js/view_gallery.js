const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchGallery() {
    const grid = document.getElementById('imageGrid');

    const { data, error } = await _supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<p>ERROR: ${error.message}</p>`;
        return;
    }

    if (data) {
        grid.innerHTML = ""; // Clear loading text
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = "gallery-item";
            card.innerHTML = `
                <img src="${item.image_url}" alt="Gallery Image">
                <div class="gallery-info">
                    <span class="gallery-user">@${item.username}</span>
                    <p style="margin: 0;">${item.caption || ""}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

fetchGallery();