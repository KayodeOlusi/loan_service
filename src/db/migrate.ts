import { readdirSync } from "fs";
import { join } from "path";
import Logger from "../lib/logger";
import { Sequelize } from "sequelize";

const migrationPaths = join(__dirname, "migrations");

async function runMigrations(db: Sequelize) {
  const queryInterface = db.getQueryInterface();
  let lastMigration: string | null = null;

  try {
    const migrationFiles = readdirSync(migrationPaths).sort();

    for (const file of migrationFiles) {
      lastMigration = file;
      const migration = (await import(join(migrationPaths, file))).default;
      Logger.info(`Running migration: ${file}`);

      await migration.up(queryInterface);
    }

    Logger.info("=========== All migrations ran successfully ================");
  } catch (e: any) {
    const error = e as Error;
    Logger.error("Migration failed: ", error);

    if (lastMigration) {
      try {
        Logger.info(`Reverting failed migration: ${lastMigration}`);
        const failedMigration = (await import(join(migrationPaths, lastMigration))).default;
        await failedMigration.down(queryInterface);
      } catch (rollbackError) {
        Logger.error("Failed to rollback migration:", rollbackError as Error);
      }
    }
  } finally {
    await db.close();
  }
}

async function revertMigration(db: Sequelize) {
  const queryInterface = db.getQueryInterface();

  try {
    const migrationFiles = readdirSync(migrationPaths).sort();

    for (const file of migrationFiles) {
      const migration = (await import(join(migrationPaths, file))).default;
      Logger.info(`Reverting migration: ${file}`);

      await migration.down(queryInterface);
    }

   Logger.info("Migrations reverted successfully");
  } catch (e) {
    const error = e as Error;
    Logger.error(error.message, error);
  } finally {
    await db.close()
  }
}

export {
  runMigrations,
  revertMigration
}