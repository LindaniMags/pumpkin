const { NextResponse } = require('next/server');
const { MongoClient, ObjectId } = require('mongodb');
const { default: clientPromise } = require('@/lib/mongodb');

export async function PUT(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const email = body.email;
  const coverPicture = body.coverPicture;
 

  console.log("api:", coverPicture);

  try {
    const user = await db.collection("Users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedData = await db.collection("Users").updateOne(
      { _id: user._id },
      { $set: { coverPicture } }
    );

    console.log("Updated data:", updatedData);

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}