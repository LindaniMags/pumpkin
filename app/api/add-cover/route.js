const { NextResponse } = require("next/server");
const { MongoClient, ObjectId } = require("mongodb");
const { default: clientPromise } = require("@/lib/mongodb");

export async function PUT(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const email = body.email;
  const coverPicture = body.coverPicture;

  // Validate the cover picture URL
  if (!coverPicture) {
    return NextResponse.json({ error: "Cover picture URL is required" }, { status: 400 });
  }

  // Validate that we're using a Firebase URL (should start with https://firebasestorage.googleapis.com/)
  if (!coverPicture.startsWith('https://firebasestorage.googleapis.com/')) {
    console.warn("Warning: Cover picture URL doesn't appear to be from Firebase Storage");
  }

  try {
    const user = await db.collection("Users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's cover picture
    const updatedData = await db
      .collection("Users")
      .updateOne({ _id: user._id }, { $set: { coverPicture } });

    console.log("Updated user cover picture successfully");

    return NextResponse.json({
      success: true,
      message: "Cover picture updated successfully",
      userData: updatedData,
    });
  } catch (error) {
    console.error("Error updating cover picture:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
