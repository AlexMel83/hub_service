/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw("CREATE EXTENSION IF NOT EXISTS postgis;");

  await knex.schema.alterTable("coworkings", function (table) {
    table.specificType("location", "geography(POINT, 4326)").nullable();
  });
  await knex.schema.alterTable("coworkings", function (table) {
    table.string("formatted_address").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("coworkings", function (table) {
    table.dropColumn("location");
    table.dropColumn("formatted_address");
  });
};
