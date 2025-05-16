const { NextResponse } = require("next/server");
const { MongoClient, ObjectId } = require("mongodb");
const { default: clientPromise } = require("@/lib/mongodb");

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();

  // Initialize comments array if it doesn't exist
  if (!body.comments) {
    body.comments = [];
  }

  const candidateData = await db.collection("Post").insertOne(body);
  return NextResponse.json(candidateData);
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    const userData = await db.collection("Post").find().sort({}).toArray();
    return NextResponse.json(userData);
  } catch (error) {
    console.error(error);
    return NextResponse.json("error", { status: 500 });
  }
}
