// If any changes are made in the database then to update you must have to restart index.js

// to run index.js first close the surver with 'ctrl +c'.

//then acces init folder with "cd init".

// then write "node index.js".

//it will conect database(data.js) to the server.

// to come out from init folder write "cd .." 


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj, 
    owner: "673e256b4a298e5840060e07",
}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();