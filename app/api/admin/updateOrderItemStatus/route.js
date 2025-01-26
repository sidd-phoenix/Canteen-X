import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import Order from '@/models/ordersmodel';

export async function PATCH(req) {
    await connectMongo();

    const { orderId, itemId, status } = await req.json();

    try {
        // Update the status of the specific item in the order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const item = order.items.id(itemId);
        if (!item) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        item.status = status; // Update the item's status
        await order.save(); // Save the updated order

        return NextResponse.json({ message: 'Item status updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
} 