// path/to/api/admin/updateOrderItemStatus.js
import connectMongo from '@/app/mongoose'; // Import your MongoDB connection
import Order from '@/models/ordersmodel'; // Import your Order model

export default async function handler(req, res) {
    await connectMongo(); // Connect to the database

    if (req.method === 'PATCH') {
        const { orderId, itemId, status } = req.body;

        try {
            // Find the order and update the item status
            const order = await Order.findOneAndUpdate(
                { _id: orderId, 'items.menuItemId': itemId },
                { $set: { 'items.$.status': status } },
                { new: true } // Return the updated document
            );

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json({ message: 'Item status updated successfully', order });
        } catch (error) {
            console.error('Error updating item status:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}