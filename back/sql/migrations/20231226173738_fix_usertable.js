/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("users", function (table) {
    table.string("activationlink", 100).nullable().alter();
    table.boolean("isactivated").defaultTo(false).notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("users", function (table) {
    table.string("activationlink", 255).nullable().alter();
    table.boolean("isactivated").defaultTo("false").notNullable().alter();
  });
};
