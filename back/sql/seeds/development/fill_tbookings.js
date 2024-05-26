/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const seedExist = await knex("bookings").select("*").where({ id: 1 });

  if (!seedExist[0]) {
    const trx = await knex.transaction();

    try {
      const bookingsData = [];

      for (let i = 1; i <= 30; i++) {
        bookingsData.push({
          user_id: Math.floor(Math.random() * 6) + 1,
          space_id: Math.floor(Math.random() * 20) + 1,
          start_time: new Date(2024, 4, 1, 9, 0, 0),
          end_time: new Date(2024, 4, 1, 18, 0, 0),
          seats: Math.floor(Math.random() * 5) + 1,
          total_price: Math.floor(Math.random() * 1000) + 100,
          is_paid: Math.random() < 0.5,
          status: ["pending", "confirmed", "cancelled"][
            Math.floor(Math.random() * 3)
          ],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      await trx("bookings").insert(bookingsData);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      console.error(error);
      throw Error("Failed migration for fill seed data");
    }
  }
};
