import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import Order from '@/models/ordersmodel';
import User from '@/models/usermodel';

export async function GET(req) {
    console.log("reached getOrders");
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const counterNumber = searchParams.get('counterNumber');

    if (!counterNumber) {
        return NextResponse.json({ message: 'Counter number is required' }, { status: 400 });
    }

    try {
        // Fetch orders for the specific counter number
        const orders = await Order.find({ 'items.assignedCounter': counterNumber });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
} 