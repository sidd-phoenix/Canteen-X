import { NextResponse } from 'next/server';
import connectMongo from '../../../mongoose'; // Path to your MongoDB connection utility
import Menu from '../../../../models/menumodel'; // Path to your Menu model
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

export async function POST(request) {
    try {
        // Connect to MongoDBef
        await connectMongo();

        // Parse the request body
        const body = await request.json();
        // console.log(body);
        // Check if an item with the same name already exists
        const existingItem = await Menu.findOne({ name: body.name });
        
        if (existingItem) {
            return NextResponse.json(
                { error: 'Food item already exists' },
                { status: 409 }  // 409 Conflict status code
            );
        }

        // Create a new menu item if no duplicate exists
        const menuItem = new Menu({
            name: body.name,
            price: body.price,
            assignedCounter: body.assignedCounter,
            category: body.category,
            isAvailable: body.isAvailable
        });

        // Save the menu item to the database
        await menuItem.save();

        // Respond with a success message
        return NextResponse.json(
            { message: 'Menu item created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Server error:', error); // Log the actual error for debugging
        return NextResponse.json(
            { error: error.message || 'Failed to create menu item' },
            { status: 500 }
        );
    }
}
