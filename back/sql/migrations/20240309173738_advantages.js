/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const trx = await knex.transaction();

  try {
    await trx.schema.dropTableIfExists("advantages");

    await trx.schema.createTable("advantages", function (table) {
      table.increments("id").primary().notNullable();
      table.string("name", 100).notNullable().index();
      table.text("description").nullable();
      table.string("icon", 100).nullable();
    });

    await trx.schema.createTable("coworkings_advantages", function (table) {
      table.increments("id").primary().notNullable();
      table
        .integer("coworking_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("coworkings");
      table
        .integer("advantage_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("advantages");
    });

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new Error("Migration for adding advantage failed: " + error.message);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const trx = await knex.transaction();

  try {
    await trx.schema.dropTableIfExists("coworkings_advantages");

    await trx.schema.dropTableIfExists("advantages");

    await trx.schema.createTable("advantages", function (table) {
      table.increments("id").primary().notNullable();
      table.string("name", 100).notNullable().index();
      table.string("icon", 100).nullable();
      table.boolean("selected").nullable();
      table.integer("coworking_id").references("id").inTable("coworkings");
    });

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new Error({
      error: error,
      message: "Migration for removing advantage failed",
    });
  }
};
