import connectMongo from '@/app/mongoose'; // Import the MongoDB connection
import User from '@/models/usermodel'; // Import the User model

export async function PUT(req, { params }) {
    await connectMongo(); // Ensure MongoDB connection is established

    const { email } = await params; // Get the email from the URL parameters
    const { phoneNumber } = await req.json(); // Get the phone number from the request body

    if (!phoneNumber) {
        return new Response(JSON.stringify({ success: false, message: 'Phone number is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Update the user's phone number in the database
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { phoneNumber: phoneNumber }, // Update the phoneNumber field
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true, user: updatedUser }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(req, { params }) {
  await connectMongo(); // Ensure MongoDB connection is established

  const { email } = params; // Get the email from the URL parameters

  try {
    // Fetch the user details from the database
    const user = await User.findOne({ email: email }).select('-__v'); // Exclude the version key from the response

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

