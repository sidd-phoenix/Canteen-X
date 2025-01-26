import crypto from 'crypto'
import Order from '@/models/ordersmodel'

export async function POST(req, res) {

    const verifySignature = (request) => {
        const body = request.headers['x-webhook-timestamp'] + request.rawBody
        const secretKey = process.env.CASHFREE_CLIENT_SECRET
        let generatedSignature = crypto.createHmac('sha256', secretKey).update(body).digest("base64");
        const signature = request.headers['x-webhook-signature']
        if (generatedSignature === signature) {
            let jsonObject = JSON.parse(rawBody)
            return jsonObject
        }
        throw new Error("Generated signature and received signature did not match.");
    }

    try {
        // Handle the webhook notification from Cashfree
        const notification = req.body;
        console.log('Received notification from Cashfree:', notification);

        // Verify the notification signature
        const verifiedNotification = verifySignature(req);

        // Update the order status in your database
        const orderId = verifiedNotification.order_id;

        // Check if the order exists and update its status
        const existingOrder = await Order.findById(orderId);
        if (existingOrder) {
            await existingOrder.save();
        } else {
            // If the order does not exist, create a new entry
            const newOrder = new Order({
                _id: orderId
            });
            await newOrder.save();
        }

        // Return a success response to Cashfree
        return res.status(200).json({ message: 'Notification received successfully' });
    } catch (error) {
        console.error('Error handling notification:', error);
        return res.status(500).json({ error: 'Error handling notification' });
    }

};