import React from 'react';
import OrderDetails from '@/components/OrderDetails';

const OrderPage = async ({ params }) => {
    const { order_id } = await params;

    return (
        <div>
            <h1>Order Page</h1>
            <OrderDetails order_id={order_id} /> {/* Pass orderId to the component */}
        </div>
    );
};

export default OrderPage;
