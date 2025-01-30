import React from 'react';
import OrderDetails from '@/components/OrderDetails';

const OrderPage = ({ params }) => {
    const { order_id } = params;

    return (
        <div>
            <h1>Order Page</h1>
            <OrderDetails order_id={order_id} /> {/* Pass orderId to the component */}
        </div>
    );
};

export default OrderPage;
