/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.createTable("favorite_spaces", function (table) {
      table.increments("id").primary().notNullable();
      table
        .integer("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("space_id")
        .notNullable()
        .references("id")
        .inTable("spaces")
        .onDelete("CASCADE");
      table.unique(["user_id", "space_id"], "user_space_unique");
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
  } catch (error) {
    throw new Error(`create favoriteSpaces tables  failed: ${error.message}`);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  try {
    await knex.schema.dropTableIfExists("favorite_spaces");
  } catch (error) {
    throw new Error(`drop favoriteSpaces tables failed: ${error.message}`);
  }
};
