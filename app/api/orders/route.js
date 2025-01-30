import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose'; // Adjust the path as necessary
import Order from '@/models/ordersmodel'; // Adjust the path to your Order model
import Menu from '@/models/menumodel'; // Import the Menu model

export async function POST(request) {
    await connectMongo();

    try {
        const { counter } = await request.json(); // Get email and counter from request
        console.log('Received counter:', counter); // Log the received counter

        // Fetch orders for the specific customerId with items having status 'pending' and assignedCounter matching
        const orders = await Order.find({
            'items.assignedCounter': counter, // Filter by assignedCounter
            'items.status': 'pending',
        });

        // Check if any orders are found
        if (orders.length === 0) {
            console.log('No orders found');
            return NextResponse.json({ message: 'No orders found' }, { status: 404 });
        }

        // Fetch menu items based on the menuItemId from the orders
        const menuItemIds = orders.flatMap(order => order.items.map(item => item.menuItemId));
        const menuItems = await Menu.find({ _id: { $in: menuItemIds } });

        // Create a map for quick lookup of menu items by their ID
        const menuItemMap = menuItems.reduce((map, item) => {
            map[item._id] = item;
            return map;
        }, {});

        // Log the fetched orders and their corresponding menu items
        orders.forEach(order => {
            // console.log('Order:', order);
            order.items.forEach(item => {
                const menuItem = menuItemMap[item.menuItemId];
                // console.log('MenuItemId:', item.menuItemId); // Log each menuItemId and its details
            });
        });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
