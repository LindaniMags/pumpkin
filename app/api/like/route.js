const { NextResponse } = require("next/server");
const { MongoClient, ObjectId } = require("mongodb");
const { default: clientPromise } = require("@/lib/mongodb");

export async function PUT(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const postId = body.postId;
  const likedUsers = body.likedUsers;
  const likes = body.likes;

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    // Convert the string postId to ObjectId
    const objectId = new ObjectId(postId);

    // Find the post by ID
    const post = await db.collection("Post").findOne({ _id: objectId });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update the post with new like data
    const updatedData = await db
      .collection("Post")
      .updateOne({ _id: objectId }, { $set: { likedUsers, likes } });

    return NextResponse.json({
      success: true,
      message: "Like status updated successfully",
      likes: likes,
      likedUsers: likedUsers,
    });
  } catch (error) {
    console.error("Error updating like status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
