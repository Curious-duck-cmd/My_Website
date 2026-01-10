async function signInWithGoogle() {
  const { data, error } = await _supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}

async function signOut() {
  const { error } = await _supabase.auth.signOut()
}