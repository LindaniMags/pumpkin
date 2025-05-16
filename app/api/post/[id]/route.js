const { NextResponse } = require('next/server');
const { MongoClient, ObjectId } = require('mongodb');
const { default: clientPromise } = require('@/lib/mongodb');

// Get a single post by ID
export async function GET(req, { params }) {
  const postId = params.id;
  
  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    
    // Convert the string postId to ObjectId
    const objectId = new ObjectId(postId);

    // Find the post
    const post = await db.collection("Post").findOne({ _id: objectId });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get user data for the post
    const user = await db.collection("Users").findOne({ email: post.email });
    
    if (user) {
      // Add user data to the post
      post.name = user.name;
      post.surname = user.surname;
      post.profilePicture = user.profilePicture;
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
