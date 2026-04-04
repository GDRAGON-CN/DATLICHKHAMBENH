const db = require("../models");
const bcrypt = require("bcryptjs");

async function run() {
  let hash = await bcrypt.hash("123456", 10);

  await db.User.create({
    email: "admin@gmail.com",
    password: hash,
    firstName: "Admin",
    lastName: "Test",
    roleId: "R1",
  });

  console.log("DONE");
}

run();
