import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding Supabase database...');

    // 1. Create a mock admin user
    const adminId = uuidv4();
    const { error: userError } = await supabase.from('users').upsert({
        id: adminId,
        email: 'admin@adda.com',
        name: 'Admin User',
        user_type: 'super_admin',
        department: 'CS',
        year: '4th',
        bio: 'Building the future of college social life.',
        interests: ['coding', 'entrepreneurship']
    });

    if (userError) console.error('Error seeding user:', userError);

    // 2. Create a mock club
    const clubId = uuidv4();
    const { error: clubError } = await supabase.from('clubs').upsert({
        id: clubId,
        name: 'Photography Club',
        tagline: 'Capture the moment',
        description: 'A community for shutterbugs and visual storytellers.',
        category: 'Arts',
        cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
        logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80',
        member_count: 42,
        approval_status: 'approved'
    });

    if (clubError) console.error('Error seeding club:', clubError);

    // 3. Create a mock event
    const { error: eventError } = await supabase.from('events').upsert({
        id: uuidv4(),
        title: 'Campus Photo Walk',
        description: 'Join us for a sunset photo walk around the main campus.',
        organizer_id: adminId,
        club_id: clubId,
        event_type: 'meetup',
        date_time: new Date(Date.now() + 86400000 * 2).toISOString(),
        location: 'Main Gate',
        cover_image_url: 'https://images.unsplash.com/photo-1520338661084-680395057c93?auto=format&fit=crop&w=800&q=80'
    });

    if (eventError) console.error('Error seeding event:', eventError);

    // 4. Create a mock gig
    const { error: gigError } = await supabase.from('gigs').upsert({
        id: uuidv4(),
        title: 'Event Photographer Needed',
        description: 'Need a photographer for the upcoming freshers party. 3 hours commitment.',
        pay_amount: '₹1500',
        gig_type: 'freelance',
        location: 'Auditorium',
        posted_by: adminId,
        status: 'open'
    });

    if (gigError) console.error('Error seeding gig:', gigError);

    // 5. Create a mock confession
    const { error: confError } = await supabase.from('confessions').upsert({
        id: uuidv4(),
        sender_id: adminId,
        recipient_name: 'Library Girl',
        message: 'I saw you reading Dune yesterday. Cool taste!',
        vibe_type: 'crush',
        status: 'approved',
        likes_count: 12,
        is_anonymous: true
    });

    if (confError) console.error('Error seeding confession:', confError);

    console.log('Seeding complete!');
}

seed();
