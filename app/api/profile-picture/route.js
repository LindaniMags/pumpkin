const { NextResponse } = require("next/server");
const { MongoClient, ObjectId } = require("mongodb");
const { default: clientPromise } = require("@/lib/mongodb");

export async function PUT(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const email = body.email;
  const profilePicture = body.profilePicture;

  // Validate the profile picture URL
  if (!profilePicture) {
    return NextResponse.json({ error: "Profile picture URL is required" }, { status: 400 });
  }

  // Validate that we're using a Firebase URL (should start with https://firebasestorage.googleapis.com/)
  if (!profilePicture.startsWith('https://firebasestorage.googleapis.com/')) {
    console.warn("Warning: Profile picture URL doesn't appear to be from Firebase Storage");
  }

  try {
    const user = await db.collection("Users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's profile picture
    const updatedData = await db
      .collection("Users")
      .updateOne({ _id: user._id }, { $set: { profilePicture } });

    console.log("Updated user profile picture successfully");

    // Also update any posts by this user to have the new profile picture
    const postsUpdateResult = await db
      .collection("Post")
      .updateMany({ email: email }, { $set: { profilePicture } });

    console.log("Updated posts with new profile picture:", postsUpdateResult);

    return NextResponse.json({
      success: true,
      message: "Profile picture updated successfully",
      userData: updatedData,
      postsUpdated: postsUpdateResult,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
