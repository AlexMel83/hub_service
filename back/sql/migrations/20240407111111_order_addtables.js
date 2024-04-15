/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const trx = await knex.transaction();
  try {
    await trx.schema.createTable("timeslots", (table) => {
      table.increments("id").primary().notNullable();
      table.timestamp("start_time").notNullable();
      table.timestamp("end_time").notNullable();
      table.string("status", 100).notNullable();
      table.integer("coworking_id").notNullable().index();
      table
        .foreign("coworking_id")
        .references("coworkings.id")
        .onDelete("CASCADE");
      table.integer("space_id").notNullable().index();
      table.foreign("space_id").references("spaces.id").onDelete("CASCADE");
    });

    await trx.schema.createTable("guests", (table) => {
      table.increments("id").primary().notNullable();
      table.string("first_name", 100).notNullable();
      table.string("last_name", 100).notNullable();
      table.string("email", 100).notNullable();
      table.string("phone", 100).notNullable();
    });

    await trx.schema.createTable("bookings", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("user_id").index();
      table.foreign("user_id").references("users.id").onDelete("SET NULL");
      table.integer("guest_id").index();
      table.foreign("guest_id").references("guests.id").onDelete("SET NULL");
      table.integer("space_id").index();
      table.foreign("space_id").references("spaces.id").onDelete("SET NULL");
      table.timestamp("start_time").notNullable();
      table.timestamp("end_time").notNullable();
      table.integer("timeslot_id").nullable();
      table.foreign("timeslot_id").references("timeslots.id");
      table.integer("seats").notNullable();
      table.integer("total_price").notNullable();
      table.boolean("is_paid").notNullable().defaultTo(false);
      table.string("status", 100).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });

    await trx.schema.createTable("booking_timeslots", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("booking_id").notNullable().index();
      table.foreign("booking_id").references("bookings.id").onDelete("CASCADE");
      table.integer("timeslot_id").notNullable().index();
      table
        .foreign("timeslot_id")
        .references("timeslots.id")
        .onDelete("CASCADE");
    });

    await trx.schema.createTable("payments", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("booking_id").notNullable().index();
      table.foreign("booking_id").references("bookings.id").onDelete("CASCADE");
      table.string("payment_method", 100).notNullable();
      table.integer("amount").notNullable();
      table.string("status", 100).notNullable();
      table.timestamp("payment_date").notNullable();
      table.string("payment_reference", 100).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });

    await trx.schema.createTable("reviews", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("user_id").notNullable().index();
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
      table.integer("coworking_id").notNullable().index();
      table
        .foreign("coworking_id")
        .references("coworkings.id")
        .onDelete("CASCADE");
      table.text("content").notNullable();
      table.integer("rating").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });

    await trx.schema.createTable("notifications", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("user_id").notNullable().index();
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
      table.integer("booking_id").notNullable().index();
      table.foreign("booking_id").references("bookings.id").onDelete("CASCADE");
      table.string("title", 100).notNullable();
      table.text("content").notNullable();
      table.boolean("is_read").notNullable().defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new Error(
      `Migration of create order tables  failed: ${error.message}`,
    );
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const trx = await knex.transaction();

  try {
    await trx.schema.dropTableIfExists("payments");
    await trx.schema.dropTableIfExists("booking_timeslots");
    await trx.schema.dropTableIfExists("notifications");
    await trx.schema.dropTableIfExists("reviews");
    await trx.schema.dropTableIfExists("bookings");
    await trx.schema.dropTableIfExists("guests");
    await trx.schema.dropTableIfExists("timeslots");

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new Error(`Migration of drop order tables failed: ${error.message}`);
  }
};
