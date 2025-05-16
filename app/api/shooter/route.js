
const { NextResponse } = require('next/server');
const { MongoClient, ObjectId } = require('mongodb');
const { default: clientPromise } = require('@/lib/mongodb');

export async function POST(req) {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    const body = await req.json();
    const candidateData = await db.collection("ShooterRequests").insertOne(body);
    return NextResponse.json(candidateData);
  }

  export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db('Pumpkin');
      const userData = await db
        .collection('ShooterRequests')
        .find()
        .sort({})
        .toArray();
      return NextResponse.json(userData);
    } catch (error) {
      console.error(error);
      return NextResponse.json('error', { status: 500 });
    }
  }

  
  export async function PUT(req) {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    const body = await req.json();
    const seen = body.seen;
    const _id = body._id; // Assuming _id is a plain string

    try {
        // Convert the plain string _id to an ObjectId
        const objectId = new ObjectId(_id);

        // Update the document
        const updatedData = await db.collection("ShooterRequests").updateOne(
            { _id: objectId }, // Use the converted ObjectId
            { $set: { seen } }
        );

        // Log the result (for debugging purposes)
        console.log("Update result:", updatedData);

        return NextResponse.json(updatedData);
    } catch (error) {
        console.error("Error updating document:", error);
        // Handle the error appropriately (e.g., return an error response)
    }
}
