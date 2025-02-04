import Order from "@/models/ordersmodel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { order_id } = await params;

    try {
        const order = await Order.findOne({ order_id });
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ success: false, message: "Error fetching order" }, { status: 500 });
    }
} 