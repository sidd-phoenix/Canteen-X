// app/api/admin/getCustomerId.js
import connectMongo from '@/app/mongoose'; // Import your MongoDB connection
import User from '@/models/usermodel'; // Import your User model
import { NextResponse } from 'next/server'; // Import NextResponse for API responses

export async function GET(request) {
    await connectMongo(); // Connect to the database

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); // Get the email from query parameters

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email }); // Find the user by email
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ counterNumber: user.counter }, { status: 200 }); // Return the counter number
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}