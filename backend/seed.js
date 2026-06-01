// Optional: run "npm run seed" once to load sample data (Rajesh Patel example)
require("dotenv").config();
const { connectDB } = require("./config/db");
const Client = require("./models/Client");
const Selection = require("./models/Selection");

(async () => {
  await connectDB();
  await Client.deleteMany({});
  await Selection.deleteMany({});

  const rajesh = await Client.create({
    name: "Rajesh Patel",
    mobile: "+91 98250 41122",
    address: "Adajan, Surat",
    notes: "Prefers matte premium finishes.",
  });

  await Selection.insertMany([
    { client: rajesh._id, brand: "Matwood", name: "303 Ply", thickness: "18mm", color: "Natural", category: "Plywood", quantity: "42 sheets", remarks: "Living + dining carcass", selectionDate: new Date("2024-08-12") },
    { client: rajesh._id, brand: "Greenply", name: "Club 710", thickness: "19mm", color: "Birch", category: "Plywood", quantity: "30 sheets", remarks: "Wet-area grade", selectionDate: new Date("2024-08-12") },
    { client: rajesh._id, brand: "Century", name: "Sainik 19mm", thickness: "19mm", color: "Amber", category: "Plywood", quantity: "24 sheets", remarks: "Wardrobe shutters", selectionDate: new Date("2024-08-12") },
  ]);

  console.log("🌱 Seed complete");
  process.exit(0);
})();
