import db from ".";
async function DbBootstrap(callback: Function) {
  try {
    await db.sequelize.authenticate();
    console.log("DB connection has been established successfully.");
    callback();
  } catch (e) {
    console.log(e, "Error in DbInitialize");
    process.exit(1);
  }
}

export default DbBootstrap;