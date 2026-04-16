import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import User from '@/models/usermodel';

export async function POST(request) {
    await connectMongo();

    const { email, counter } = await request.json();

    try {
        console.log('Searching for user with email:', email);
        const user = await User.findOne({ email });

        if (user) {
            // User exists — update their role and counter
            user.role = 'order_taker';
            user.counter = counter;
            await user.save();
            return NextResponse.json({ message: 'Existing user updated to Order Taker successfully.' }, { status: 200 });
        } else {
            // User does not exist — create a new order_taker account
            console.log('User not found, creating new order_taker account.');
            await User.create({
                name: email.split('@')[0], // Use the email prefix as a placeholder name
                email: email,
                role: 'order_taker',
                counter: counter,
            });
            return NextResponse.json({ message: 'New Order Taker account created successfully.' }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
}
