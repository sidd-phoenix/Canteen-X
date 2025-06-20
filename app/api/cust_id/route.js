import { NextResponse } from "next/server";
import User from "@/models/usermodel"; // Import the User model

export async function POST(req, res) {
  try {
    const requestData = await req.json();
    const { email } = requestData; // Extract email from the request body

    // Fetch the user from MongoDB using the email
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const customer_id = user._id; // Get the user ID from the database

    return NextResponse.json({
      success: true,
      customer_id: customer_id,
      customer_name: user.name, // Include customer name
      customer_email: user.email, // Include customer email
    });
  } catch (error) {
    console.error("Error fetching customer ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing the request.",
      },
      { status: 500 }
    );
  }
}
