import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import Order from '@/models/ordersmodel';
import User from '@/models/usermodel';
import { getSession } from 'next-auth/react';

export async function GET(req) {
    await connectMongo();

    // Get the session from the request
    const session = await getSession();


    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;

    try {
        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Fetch orders for the specific counter number
        const orders = await Order.find({ 'items.assignedCounter': user.counter });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
} 