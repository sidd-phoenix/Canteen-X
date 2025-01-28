import connectMongo from '@/app/mongoose'; // Adjust the path as necessary
import Menu from '@/models/menumodel'; // Adjust the path as necessary

export async function GET(req, { params }) {
  await connectMongo();
  const { item_id } =  await params; // Extract item_id from the request parameters
    console.log(item_id)
  try {
    const menuItem = await Menu.findById(item_id); // Fetch the menu item by ID
    if (!menuItem) {
      return new Response('Item not found', { status: 404 });
    }
    return new Response(JSON.stringify(menuItem), { status: 200 }); // Return the found item
  } catch (error) {
    return new Response('Failed to fetch menu item', { status: 500 });
  }
}
