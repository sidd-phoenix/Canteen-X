import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose'; // Adjust the path as necessary
import Order from '@/models/ordersmodel'; // Adjust the path to your Order model
import Menu from '@/models/menumodel'; // Import the Menu model

export async function GET(request) {
    await connectMongo();

    try {
        // Fetch all orders from the database
        const orders = await Order.find();
        console.log('Orders:', orders);
        if (orders.length === 0) {
            return NextResponse.json({ message: 'No orders found' }, { status: 404 });
        }

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
