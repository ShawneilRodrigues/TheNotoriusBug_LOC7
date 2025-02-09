import { supabase } from '@/utils/superbaseClient';

export async function storeUserInSupabase(user: {
    email: string;
    name?: string;
    phone_number?: string;
    role?: string;
    is_admin?: boolean;
}) {
    try {
        // Check if the user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError.message);
            return { success: false, error: fetchError.message };
        }

        if (existingUser) {
            // User exists, update their details
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    name: user.name || existingUser.name,
                    phone_number: user.phone_number || existingUser.phone_number,
                    role: user.role || existingUser.role,
                    is_admin: user.is_admin ?? existingUser.is_admin,
                })
                .eq('email', user.email);

            if (updateError) {
                console.error('Error updating user:', updateError.message);
                return { success: false, error: updateError.message };
            }

            console.log('User updated successfully');
            return { success: true, message: 'User updated' };
        } else {
            // Insert new user (DO NOT include 'id')
            const { error: insertError } = await supabase.from('users').insert([
                {
                    email: user.email,
                    name: user.name || null,
                    phone_number: user.phone_number || null,
                    role: user.role || 'employee',
                    is_admin: user.is_admin || false,
                },
            ]);

            if (insertError) {
                console.error('Error inserting user:', insertError.message);
                return { success: false, error: insertError.message };
            }

            console.log('User added successfully');
            return { success: true, message: 'User added' };
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Unexpected error occurred' };
    }
}
