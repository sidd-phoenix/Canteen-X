import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose'; // Adjust the path as necessary
import Order from '@/models/ordersmodel'; // Adjust the path to your Order model

export async function POST(request) {
    await connectMongo();

    try {
        const { orderId, itemId } = await request.json();
        console.log('Received orderId and itemId:', orderId, itemId); // Log the received IDs

        if (!orderId || !itemId) {
            return NextResponse.json({ message: 'Order ID and Item ID are required' }, { status: 400 });
        }

        // Find the order and update the item status
        const order = await Order.findById(orderId);
        // console.log('Order:', order);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const item = order.items.find(item => item.menuItemId.toString() === itemId);
        console.log('Item:', item);
        if (!item) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        // Update item status to 'ready'
        item.status = 'ready';
        await order.save();

        // Check if all items are ready and update order status
        const allItemsReady = order.items.every(i => i.status === 'ready');
        if (allItemsReady) {
            order.status = 'completed';
            await order.save();
        }

        return NextResponse.json({ message: 'Item status updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating item status:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
