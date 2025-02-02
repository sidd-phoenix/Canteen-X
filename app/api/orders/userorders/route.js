import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import Order from '@/models/ordersmodel';
import User from '@/models/usermodel'; // Assuming you have a User model

export async function POST(request) {
    await connectMongo();

    try {
        const { email } = await request.json();

        // Find the user by email
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Find orders by customerId
        const orders = await Order.find({ customerId: user._id });
        console.log(orders);
        if (orders.length === 0) {
            return NextResponse.json({ message: 'No orders found' }, { status: 404 });
        }

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
