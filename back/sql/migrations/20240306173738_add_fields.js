/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (!(await knex.schema.hasColumn("users", "name"))) {
    await knex.schema.alterTable("users", function (table) {
      table.string("name", 100).nullable().after("password");
    });
  }

  if (!(await knex.schema.hasColumn("users", "surname"))) {
    await knex.schema.alterTable("users", function (table) {
      table.string("surname", 100).nullable().after("name");
    });
  }

  if (!(await knex.schema.hasColumn("users", "phone"))) {
    await knex.schema.alterTable("users", function (table) {
      table.string("phone", 100).nullable().after("surname");
    });
  }

  const constraintName = "coworkings_coworking_name_unique";
  const constraintExists = await knex.schema
    .raw(
      `select * from pg_indexes where tablename = 'coworkings' and indexname = ?`,
      [constraintName],
    )
    .then((result) => result.rows.length > 0);

  if (constraintExists) {
    await knex.schema.alterTable("coworkings", function (table) {
      table.dropUnique("coworking_name");
    });
  }

  if (!(await knex.schema.hasColumn("coworkings", "published"))) {
    await knex.schema.alterTable("coworkings", function (table) {
      table.boolean("published").defaultTo(false).notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  if (await knex.schema.hasColumn("users", "name")) {
    await knex.schema.alterTable("users", function (table) {
      table.dropColumn("name");
    });
  }

  if (await knex.schema.hasColumn("users", "surname")) {
    await knex.schema.alterTable("users", function (table) {
      table.dropColumn("surname");
    });
  }

  if (await knex.schema.hasColumn("users", "phone")) {
    await knex.schema.alterTable("users", function (table) {
      table.dropColumn("phone");
    });
  }

  const constraintExists = await knex.schema
    .raw(
      `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = ? AND constraint_type = 'UNIQUE'`,
      ["coworkings"],
    )
    .then((result) =>
      result.rows.some(
        (row) => row.constraint_name === "coworkings_coworking_name_unique",
      ),
    );

  const hasCoworkingNameColumn = await knex.schema.hasColumn(
    "coworkings",
    "coworking_name",
  );
  const isCoworkingNameTypeRight = hasCoworkingNameColumn
    ? await knex.schema
        .raw(
          `SELECT data_type FROM information_schema.columns WHERE table_name = 'coworkings' AND column_name = 'coworking_name';`,
        )
        .then((result) => result.rows[0].data_type === "character varying")
    : false;

  if (hasCoworkingNameColumn && !isCoworkingNameTypeRight) {
    await knex.schema.alterTable("coworkings", function (table) {
      table.string("coworking_name", 100).alter();
    });
  }

  const isCoworkingNameUnique =
    hasCoworkingNameColumn && !constraintExists && isCoworkingNameTypeRight;
  if (isCoworkingNameUnique) {
    await knex.schema.alterTable("coworkings", function (table) {
      table.unique("coworking_name");
    });
  }

  if (await knex.schema.hasColumn("coworkings", "published")) {
    await knex.schema.alterTable("coworkings", function (table) {
      table.dropColumn("published");
    });
  }
};
