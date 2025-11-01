import db from ".";

async function DbBootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("DB connection has been established successfully.");
  } catch (e) {
    console.log(e, "Error in DbInitialize");
    process.exit(1);
  }
}

export default DbBootstrap;
