const { NextResponse } = require('next/server');
const { MongoClient, ObjectId } = require('mongodb');
const { default: clientPromise } = require('@/lib/mongodb');

// Add a comment to a post
export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const { postId, comment } = body;

  try {
    // Convert the string postId to ObjectId
    const objectId = new ObjectId(postId);

    // Find the post
    const post = await db.collection("Post").findOne({ _id: objectId });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Initialize comments array if it doesn't exist
    const comments = post.comments || [];
    
    // Add the new comment with a timestamp
    comments.push({
      ...comment,
      timestamp: new Date(),
      _id: new ObjectId() // Generate a unique ID for the comment
    });

    // Update the post with the new comments array
    const updatedData = await db.collection("Post").updateOne(
      { _id: objectId },
      { $set: { comments } }
    );

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get comments for a post
export async function GET(req) {
  const url = new URL(req.url);
  const postId = url.searchParams.get('postId');

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

    // Return the comments array or an empty array if it doesn't exist
    return NextResponse.json(post.comments || []);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a comment
export async function DELETE(req) {
  const body = await req.json();
  const { postId, commentId } = body;

  if (!postId || !commentId) {
    return NextResponse.json({ error: 'Post ID and Comment ID are required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    
    // Convert the string IDs to ObjectId
    const postObjectId = new ObjectId(postId);
    const commentObjectId = new ObjectId(commentId);

    // Find the post
    const post = await db.collection("Post").findOne({ _id: postObjectId });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Filter out the comment to be deleted
    const updatedComments = (post.comments || []).filter(
      comment => comment._id.toString() !== commentObjectId.toString()
    );

    // Update the post with the filtered comments array
    const updatedData = await db.collection("Post").updateOne(
      { _id: postObjectId },
      { $set: { comments: updatedComments } }
    );

    return NextResponse.json({ success: true, comments: updatedComments });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
