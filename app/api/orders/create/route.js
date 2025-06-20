import { NextResponse } from "next/server";
import Order from "@/models/ordersmodel";
import connectMongo from "@/app/mongoose";

export async function POST(req) {
  try {
    await connectMongo();
    
    const requestData = await req.json();
    const { 
      customerId, 
      dailyOrderNumber, 
      items, 
      totalAmount, 
      status = 'pending',
      placedAt = new Date()
    } = requestData;

    // Create new order with daily order number
    const newOrder = new Order({
      customerId,
      dailyOrderNumber,
      items,
      totalAmount,
      status,
      placedAt
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({
      success: true,
      message: "Order created successfully!",
      order: savedOrder
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error creating order.",
      },
      { status: 500 }
    );
  }
} 