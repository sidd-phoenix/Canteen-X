import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import User from '@/models/usermodel';

export async function GET(req) {
    console.log("reached getCustomerId");
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ counterNumber: user.counter }, { status: 200 }); // Return counter number
    } catch (error) {
        console.error('Error fetching customer ID:', error);
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
}