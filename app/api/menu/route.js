import connectMongo from '@/app/mongoose' // Adjust the path as necessary
import Menu from '@/models/menumodel' // Adjust the path as necessary

export async function GET(req) {
  await connectMongo()
  try {
    const menuItems = await Menu.find({isAvailable: true})
    return new Response(JSON.stringify(menuItems), { status: 200 })
  } catch (error) {
    return new Response('Failed to fetch menu items', { status: 500 })
  }
}

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await connectMongo();
  try {
    const updateData = await req.json(); // Get the new data from the request body
    const updatedItem = await Menu.findByIdAndUpdate(id, updateData, { new: true }); // Update the item
    if (!updatedItem) {
      return new Response('Item not found', { status: 404 });
    }
    return new Response(JSON.stringify(updatedItem), { status: 200 }); // Return the updated item
  } catch (error) {
    return new Response('Failed to update menu item', { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  await connectMongo()
  try {
    const deletedItem = await Menu.findByIdAndDelete(id); // Ensure the item is deleted from the database
    if (!deletedItem) {
      return new Response('Item not found', { status: 404 });
    }
    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    return new Response('Failed to delete menu item', { status: 500 });
  }
}

export async function POST(req) {
  await connectMongo();
  try {
    const { name, price, category, isAvailable, assignedCounter, imageUrl } = await req.json();

    // Validate that imageUrl is provided
    if (!imageUrl) {
      return new Response('Image URL is required', { status: 400 });
    }

    const newMenuItem = new Menu({
      name,
      price,
      category,
      isAvailable,
      assignedCounter,
      imageUrl,
    });

    await newMenuItem.save();
    return new Response(JSON.stringify(newMenuItem), { status: 201 });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return new Response('Failed to add menu item', { status: 500 });
  }
} 