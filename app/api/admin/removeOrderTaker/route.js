import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import User from '@/models/usermodel';

export async function POST(request) {
    console.log("reached removeOrderTaker")
    await connectMongo();

    const { email } = await request.json();

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user || user.role !== 'order_taker') {
            return NextResponse.json({ message: 'Order Taker not found.' }, { status: 404 });
        }

        // Update user role to customer
        user.role = 'customer';
        user.counter = null;

        // Save the updated user
        await user.save();

        return NextResponse.json({ message: 'Order Taker removed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
