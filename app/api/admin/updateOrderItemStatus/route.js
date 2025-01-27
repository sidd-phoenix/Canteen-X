import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import Order from '@/models/ordersmodel';

export async function PATCH(req) {
    console.log("reached updateOrderItemStatus");
    await connectMongo();

    const { orderId, itemId, status } = await req.json();
    console.log('Received:', { orderId, itemId, status }); // Log the received data

    if (!orderId || !itemId || !status) {
        return NextResponse.json({ message: 'Order ID, Item ID, and Status are required' }, { status: 400 });
    }

    try {
        // Find the order by orderId
        const order = await Order.findById(orderId);
        if (!order) {
            console.error('Order not found:', orderId); // Log if order is not found
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Update the status of the specific item
        const item = order.items.id(itemId);
        if (!item) {
            console.error('Item not found:', itemId); // Log if item is not found
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        item.status = status; // Update the item's status
        await order.save(); // Save the updated order

        return NextResponse.json({ message: 'Item status updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating item status:', error);
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
} 