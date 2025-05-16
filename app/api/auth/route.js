const { NextResponse } = require("next/server");
const { MongoClient } = require("mongodb");
const { default: clientPromise } = require("@/lib/mongodb");

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("Pumpkin");
  const body = await req.json();
  const candidateData = await db.collection("Users").insertOne(body);
  return NextResponse.json(candidateData);
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Pumpkin");
    const userData = await db.collection("Users").find().sort({}).toArray();
    return NextResponse.json(userData);
  } catch (error) {
    console.error(error);
    return NextResponse.json("error", { status: 500 });
  }
}
