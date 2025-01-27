import { NextResponse } from 'next/server';
import connectMongo from '@/app/mongoose';
import User from '@/models/usermodel';

export async function GET() {
    await connectMongo();

    try {
        // Find all users with the role of order_taker
        const orderTakers = await User.find({ role: 'order_taker' });

        return NextResponse.json({ orderTakers }, { status: 200 });
    } catch (error) {
        // Return a JSON response with the error message
        return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
    }
}
