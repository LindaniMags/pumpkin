const { NextResponse } = require('next/server');
const { MongoClient, ObjectId } = require('mongodb');
const { default: clientPromise } = require('@/lib/mongodb');

// Create a new comment notification
export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  
  try {
    // Add timestamp and seen status
    const notification = {
      ...body,
      timestamp: new Date(),
      seen: false,
      type: 'comment'
    };
    
    const result = await db.collection("CommentNotifications").insertOne(notification);
    return NextResponse.json({ success: true, notification: { ...notification, _id: result.insertedId } });
  } catch (error) {
    console.error("Error creating comment notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get all comment notifications
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('Pumpkin');
    const notifications = await db
      .collection('CommentNotifications')
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json('error', { status: 500 });
  }
}

// Mark notification as seen
export async function PUT(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const { _id, seen } = body;

  try {
    // Convert the string _id to ObjectId
    const objectId = new ObjectId(_id);

    // Update the notification
    const updatedData = await db.collection("CommentNotifications").updateOne(
      { _id: objectId },
      { $set: { seen } }
    );

    return NextResponse.json({ success: true, updated: updatedData });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
