import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose'; // Adjust the path as necessary
import Order from '@/models/ordersmodel'; // Adjust the path to your Order model
import User from '@/models/usermodel'; // Adjust the path to your User model

export async function POST(request) {
    await connectMongo();

    try {
        const { email } = await request.json();
        console.log('Received email:', email); // Log the received email

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Fetch the customerId using the user's email
        const user = await User.findOne({ email });
        console.log('Found user:', user); // Log the found user

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const customerId = user._id;
        console.log('Customer ID:', customerId); // Log the customerId

        // Fetch orders for the specific customerId
        const orders = await Order.find({ customerId });
        console.log('Fetched orders:', orders); // Log the fetched orders

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
