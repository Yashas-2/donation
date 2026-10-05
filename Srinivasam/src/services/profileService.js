import { supabase } from '../lib/supabaseClient';

/**
 * Ensure or upsert a user profile in the public.profiles table.
 * Defaults user role to 'donor' for safety.
 */
export async function ensureUserProfile(user, fullNameInput = null, roleInput = null) {
  if (!user) return null;

  const fullName =
    fullNameInput ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Donor';

  let role = roleInput || user.user_metadata?.role || 'donor';
  if (role === 'platform_admin') role = 'admin';
  if (role === 'orphanage_admin') role = 'orphanage';

  const profileData = {
    id: user.id,
    full_name: fullName,
    email: user.email,
    role: role,
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Note on profiles upsert:', error.message || error);
      // Fallback object if table is missing or RLS restricts single return
      return profileData;
    }

    return data || profileData;
  } catch (err) {
    console.warn('Error syncing profile:', err);
    return profileData;
  }
}

/**
 * Fetch profile data for the active authenticated user
 */
export async function getUserProfile(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching user profile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error fetching profile:', err);
    return null;
  }
}
