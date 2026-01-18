// Ensure this file is loaded as type="module"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Note: Ensure the Supabase CDN script is in your HTML head 
// or that you've imported it if using a bundler.
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function fetchGallery() {
    const grid = document.getElementById('imageGrid');
    
    // Safety check for the HTML element
    if (!grid) {
        console.error("Error: Element with ID 'imageGrid' not found in HTML.");
        return;
    }

    console.log("Accessing storage units...");

    const { data, error } = await _supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Database error:", error.message);
        grid.innerHTML = `<p style="color:red;">DATABASE ERROR: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = "<p>No posts found. Add some in the dashboard!</p>";
        return;
    }

    // Clear loading text and render items
    grid.innerHTML = ""; 
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = "gallery-item";
        card.innerHTML = `
            <img src="${item.image_url}" alt="Gallery Image" onerror="this.src='https://placehold.co/400?text=Image+Not+Found'">
            <div class="gallery-info">
                <span class="gallery-user">@${item.username || 'anonymous'}</span>
                <p style="margin: 5px 0 0 0;">${item.caption || ""}</p>
                <small style="opacity: 0.6; font-size: 0.7rem;">
                    ${new Date(item.created_at).toLocaleDateString()}
                </small>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Run the fetch on page load
fetchGallery();