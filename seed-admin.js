const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function seedAdmin() {
    const email = 'admin@example.com';
    const password = 'password123';

    console.log(`Setting up admin user: ${email}`);

    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        console.log('User already exists, deleting old record to reset password...');
        await supabase.from('users').delete().eq('email', email);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password_hash }])
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('✅ Success! Admin user created.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }
}

seedAdmin();
