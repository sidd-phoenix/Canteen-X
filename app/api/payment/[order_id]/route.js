import { Cashfree } from 'cashfree-pg';
import mongoose from 'mongoose';
import Order from '@/models/ordersmodel';


export async function GET(request, { params }) {
    const { order_id } = await params;

    Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID
    Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET
    const version = process.env.CASHFREE_VERSION;

    try {

        const orderData = await Cashfree.PGFetchOrder(version, order_id);

        if (orderData.data.order_status == 'PAID') {
            const order = await Cashfree.PGFetchOrderExtendedData(version, order_id)
            console.log(order.data)
            console.log(order.data.cart.items)

            
            const items = order.data.cart.items.map(item => ({
                menuItemId: item.item_id, // Assuming this is the correct field
                name: item.item_name,
                price: item.item_discounted_unit_price,
                quantity: item.item_quantity,
                assignedCounter: Number(item.item_description),
                status: 'pending', // Default status for each item
            }));

            console.log(items)

            // Create a new order document
            const newOrder = new Order({
                customerId: orderData.data.customer_details.customer_id,
                items: items,
                totalAmount: orderData.data.order_amount,
                status: 'pending',
            });

            // Save the order to MongoDB
            await newOrder.save();
        }
        else
            console.log('Fail')



        return new Response(JSON.stringify({ status: orderData.data.order_status }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching order data:', error);
        return new Response('Error fetching order data', { status: 500 });
    }
}
