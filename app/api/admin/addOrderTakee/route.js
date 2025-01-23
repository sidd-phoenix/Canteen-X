import { NextResponse } from 'next/server';
import connectMongo from '../../../mongoose'; 
import User from '../../../../models/usermodel';

export async function POST(request) {
    await connectMongo();

    const { email, counter } = await request.json();

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found. Please register your email as a customer.' }, { status: 404 });
        }

        // Update user detail
        user.role = 'order_taker';
        user.counter = counter;

        // Save the updated user
        await user.save();

        return NextResponse.json({ message: 'Order Taker updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
