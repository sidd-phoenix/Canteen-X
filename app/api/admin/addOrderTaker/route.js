import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose'; 
import User from '@/models/usermodel';

export async function POST(request) {
    await connectMongo();

    const { email, counter } = await request.json();

    try {
        console.log('Searching for user with email:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return NextResponse.json({ message: 'User not found. Please register your email as a customer.' }, { status: 404 });
        }

        // Update user detail
        user.role = 'order_taker';
        user.counter = counter;

        // Save the updated user
        await user.save();

        return NextResponse.json({ message: 'Order Taker updated successfully' }, { status: 200 });
    } catch (error) {
        // Return a JSON response with the error message
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
}
