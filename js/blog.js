// Initialize Supabase (Use your keys here)
const SUPABASE_URL = 'https://bcdadmarkuzavlcwjjhs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5qpRTrEY01_irr2ImlcONw_WEqaupbX';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const feed = document.getElementById('blogFeed');
const publishBtn = document.getElementById('publishBtn');

// 1. Publish a Post
publishBtn.onclick = async () => {
    const title = document.getElementById('postTitle').value;
    const mood = document.getElementById('postMood').value;
    const content = document.getElementById('postContent').value;

    if(!title || !content) return alert("Fill in the title and content!");

    const { error } = await _supabase.from('blog_posts').insert([
        { title, mood, content }
    ]);

    if(error) alert(error.message);
    else location.reload();
}

// 2. Fetch and Show Posts
async function loadPosts() {
    const { data, error } = await _supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if(data) {
        feed.innerHTML = ''; // Clear loading text
        data.forEach(post => {
            const date = new Date(post.created_at).toLocaleDateString();
            const entry = document.createElement('div');
            entry.className = 'post-entry'; // Add this to your CSS
            entry.innerHTML = `
                <div style="border-bottom: 2px solid #000; margin-bottom: 10px; padding-bottom: 5px;">
                    <span style="font-size: 0.8rem; opacity: 0.6;">${date} | Mood: ${post.mood || 'Normal'}</span>
                    <h2 style="margin: 5px 0;">> ${post.title}</h2>
                </div>
                <p style="white-space: pre-wrap;">${post.content}</p>
                <hr style="margin-top: 20px; border: 1px dashed #000; opacity: 0.3;">
            `;
            feed.appendChild(entry);
        });
    }


}

loadPosts();


// show blog
