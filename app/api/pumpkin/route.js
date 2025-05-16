
const { NextResponse } = require('next/server');
const { MongoClient, ObjectId } = require('mongodb');
const { default: clientPromise } = require('@/lib/mongodb');

export async function POST(req) {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    const body = await req.json();
    const candidateData = await db.collection("PumpkinRequests").insertOne(body);
    return NextResponse.json(candidateData);
  }

  export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db('Pumpkin');
      const userData = await db
        .collection('PumpkinRequests')
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
        const updatedData = await db.collection("PumpkinRequests").updateOne(
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



export async function DELETE(req) {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    const body = await req.json();
    const email = body.email;
 


  try {
    const user = await db.collection("PumpkinRequests").findOne({ email });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
        // Delete the document
        const deleteResult = await db.collection("PumpkinRequests").deleteOne(
            { _id: user._id },
          );
     

        // Log the result (for debugging purposes)
        console.log("Delete result:", deleteResult);

        return NextResponse.json(deleteResult);
    } catch (error) {
        console.error("Error deleting document:", error);
        // Handle the error appropriately (e.g., return an error response)
    }
}