/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const coworkingsExists = await knex.schema.hasTable("coworkings");
  const spacesExists = await knex.schema.hasTable("spaces");
  const advantagesExist = await knex.schema.hasTable("advantages");
  const pricesExists = await knex.schema.hasTable("prices");
  const coworking_worktimeExists =
    await knex.schema.hasTable("coworking_worktime");
  const usersExists = await knex.schema.hasTable("users");
  const tokensExists = await knex.schema.hasTable("tokens");
  const coworkingsusersExists = await knex.schema.hasTable("coworkingsusers");

  const trx = await knex.transaction();

  try {
    if (!coworkingsExists) {
      await trx.schema.createTable("coworkings", function (table) {
        table.increments("id").primary().notNullable();
        table.string("coworking_name", 100).notNullable().unique().index();
        table.string("address").nullable();
        table.string("phone", 100).nullable();
        table.string("email", 100).nullable();
        table.text("social").nullable();
        table.string("coworking_photo", 100).nullable();
        table.text("description").nullable();
        table.integer("user_id").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
      });
    }

    if (!spacesExists) {
      await trx.schema.createTable("spaces", function (table) {
        table.increments("id").primary().notNullable();
        table.string("space_name", 100).notNullable().index();
        table.text("description").nullable();
        table.string("space_photo", 100).nullable();
        table.integer("amount").nullable();
        table.integer("first_price").nullable();
        table.text("last_price").nullable();
        table.integer("coworking_id").references("id").inTable("coworkings");
      });
    }

    if (!advantagesExist) {
      await trx.schema.createTable("advantages", function (table) {
        table.increments("id").primary().notNullable();
        table.string("name", 100).notNullable().index();
        table.string("icon", 100).nullable();
        table.boolean("selected").nullable();
        table.integer("coworking_id").references("id").inTable("coworkings");
      });
    }

    if (!pricesExists) {
      await trx.schema.createTable("prices", function (table) {
        table.increments("id").primary().notNullable();
        table.integer("first_price").nullable();
        table.integer("last_price").nullable();
        table.integer("workday").nullable();
        table.integer("weekend").nullable();
        table.integer("hour").nullable();
        table.integer("amount").nullable();
        table.integer("coworking_id").references("id").inTable("coworkings");
      });
    }

    if (!coworking_worktimeExists) {
      await trx.schema.createTable("coworking_worktime", function (table) {
        table.increments("id").primary().notNullable();
        table.string("start_work", 100).nullable();
        table.string("end_work", 100).nullable();
        table.string("work_day_start", 100).nullable();
        table.string("work_day_end", 100).nullable();
        table.string("dayoff_start", 100).nullable();
        table.string("dayoff_end", 100).nullable();
        table.integer("coworking_id").references("id").inTable("coworkings");
      });
    }

    if (!usersExists) {
      await trx.schema.createTable("users", function (table) {
        table.increments("id").primary().notNullable();
        table.string("email", 100).notNullable().unique().index();
        table.string("password", 100).notNullable();
        table.string("role", 50).defaultTo("user").notNullable();
        table.string("activationlink", 255).nullable().index();
        table.boolean("isactivated").defaultTo("false").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
      });
    }

    if (!tokensExists) {
      await trx.schema.createTable("tokens", function (table) {
        table.increments("id").primary().notNullable().unique();
        table.integer("user_id").notNullable().index();
        table.text("refreshtoken").notNullable().index();
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      });
    }

    if (!coworkingsusersExists) {
      await trx.schema.createTable("coworkingsusers", function (table) {
        table.increments("id").primary().notNullable();
        table.integer("user_id").notNullable();
        table
          .integer("coworking_id")
          .notNullable()
          .references("id")
          .inTable("coworkings")
          .onDelete("CASCADE");
      });
    }

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw Error({
      error: error,
      message: "Migration for create tables failed",
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const trx = await knex.transaction();

  try {
    await trx.schema.dropTableIfExists("coworkingsusers");
    await trx.schema.dropTableIfExists("users");
    await trx.schema.dropTableIfExists("tokens");
    await trx.schema.dropTableIfExists("coworking_worktime");
    await trx.schema.dropTableIfExists("prices");
    await trx.schema.dropTableIfExists("advantages");
    await trx.schema.dropTableIfExists("spaces");
    await trx.schema.dropTableIfExists("coworkings");

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw Error({
      error: error,
      message: "Migration for removing tables failed",
    });
  }
};
