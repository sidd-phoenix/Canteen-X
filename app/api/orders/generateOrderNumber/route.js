import { NextResponse } from "next/server";
import Order from "@/models/ordersmodel";
import connectMongo from "@/app/mongoose";

export async function POST(req) {
  try {
    await connectMongo();

    // Get today's date in YYYY-MM-DD format (IST timezone)
    const today = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(today.getTime() + istOffset);
    const todayString = istDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Find the highest order number for today
    const startOfDay = new Date(todayString + 'T00:00:00.000Z');
    const endOfDay = new Date(todayString + 'T23:59:59.999Z');

    const lastOrder = await Order.findOne({
      placedAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ dailyOrderNumber: -1 });

    // Generate new order number
    const newOrderNumber = lastOrder ? lastOrder.dailyOrderNumber + 1 : 1;

    return NextResponse.json({
      success: true,
      dailyOrderNumber: newOrderNumber,
      date: todayString
    });

  } catch (error) {
    console.error("Error generating order number:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error generating order number.",
      },
      { status: 500 }
    );
  }
} 