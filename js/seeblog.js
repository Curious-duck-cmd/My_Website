const SUPABASE_URL = 'https://bcdadmarkuzavlcwjjhs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5qpRTrEY01_irr2ImlcONw_WEqaupbX';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


async function fetchLogs() {
    const feed = document.getElementById('blogFeed');

    const { data, error } = await _supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        feed.innerHTML = `<p style="color:red;">ERROR_LOADING_DATA: ${error.message}</p>`;
        return;
    }

    if (data) {
        feed.innerHTML = ""; // Clear the loading text
        data.forEach(log => {
            const date = new Date(log.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            const entry = document.createElement('div');
            entry.className = "log-entry";
            entry.innerHTML = `
                <div class="log-header">
                    <span>LOG_REF: ${log.id.substring(0,6).toUpperCase()}</span>
                    <span>TIMESTAMP: ${date}</span>
                </div>
                <div class="log-body">
                    <b class="log-title">> ${log.title}</b>
                    <p class="log-text">${log.content}</p>
                </div>
            `;
            feed.appendChild(entry);
        });
    }
}

// Initial Load
fetchLogs();