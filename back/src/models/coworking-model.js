const knex = require("../../config/knex.config");
const COWORKINGS_TABLE = "coworkings",
  PRICES_TABLE = "prices",
  SPACES_TABLE = "spaces",
  CA_TABLE = "coworkings_advantages",
  WORKTIME_TABLE = "coworking_worktime";
const ApiError = require("./../exceptions/api-errors");
const advantageModel = require("./advantage-model");
const spaceModel = require("./space-model");

const mainfields = [
    "coworkings.id",
    "coworking_name",
    "address",
    "phone",
    "email",
    "social",
    "coworking_photo",
    "description",
    "user_id",
    "published",
    "prices.first_price as first_price",
    "prices.last_price as last_price",
    "prices.workday as workday",
    "prices.weekend as weekend",
    "prices.hour as hour",
    "prices.amount as amount",
    "coworking_worktime.start_work as start_work",
    "coworking_worktime.end_work as end_work",
    "coworking_worktime.work_day_start as workday_start",
    "coworking_worktime.work_day_end as workday_end",
    "coworking_worktime.dayoff_start as dayoff_start",
    "coworking_worktime.dayoff_end as dayoff_end",
  ],
  coworkingFields = [
    "coworkings.id",
    "coworking_name",
    "address",
    "phone",
    "email",
    "social",
    "coworking_photo",
    "description",
    "user_id",
    "published",
    "created_at",
    "updated_at",
  ],
  pricesFields = [
    "prices.id",
    "first_price",
    "last_price",
    "workday",
    "weekend",
    "hour",
    "amount",
    "coworking_id",
  ],
  worktimeFields = [
    "coworking_worktime.id",
    "start_work",
    "end_work",
    "work_day_start",
    "work_day_end",
    "dayoff_start",
    "dayoff_end",
    "coworking_id",
  ];

function parseAdvantageIds(advantageIdsString) {
  return advantageIdsString
    .replace(/[^0-9,]/g, "")
    .split(",")
    .map((id) => parseInt(id, 10))
    .filter((id) => !Number.isNaN(id));
}

module.exports = {
  async getCoworkings() {
    try {
      const coworkingsData = await knex(COWORKINGS_TABLE)
        .leftJoin(PRICES_TABLE, "coworkings.id", "=", "prices.coworking_id")
        .leftJoin(
          WORKTIME_TABLE,
          "coworkings.id",
          "=",
          "coworking_worktime.coworking_id",
        )
        .select(mainfields);

      if (!coworkingsData.length) {
        throw ApiError.NotFoundError("coworkings");
      }

      const result = await Promise.all(
        coworkingsData.map(async (coworking) => {
          const advantages = await advantageModel.getAdvantagesByCoworkingId(
            coworking.id,
          );
          const spaces = await spaceModel.getSpacesByCoworkingId(coworking.id);
          return { ...coworking, advantages, spaces };
        }),
      );

      if (!result.length) {
        throw ApiError.NotFoundError("data not found");
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getCoworkingsByName(name) {
    try {
      const coworkingsData = await knex(COWORKINGS_TABLE)
        .leftJoin(PRICES_TABLE, "coworkings.id", "=", "prices.coworking_id")
        .leftJoin(
          WORKTIME_TABLE,
          "coworkings.id",
          "=",
          "coworking_worktime.coworking_id",
        )
        .select(mainfields)
        .whereRaw("LOWER(coworkings.coworking_name) LIKE ?", [
          `%${name.toLowerCase()}%`,
        ]);

      const coworkings = await Promise.all(
        coworkingsData.map(async (coworking) => {
          const advantages = await advantageModel.getAdvantagesByCoworkingId(
            coworking.id,
          );
          const spaces = await spaceModel.getSpacesByCoworkingId(coworking.id);
          return { ...coworking, advantages, spaces };
        }),
      );

      return coworkings;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async getOneCoworkingById(id, trx = knex) {
    try {
      const coworkingsData = await trx(COWORKINGS_TABLE)
        .leftJoin(PRICES_TABLE, "coworkings.id", "=", "prices.coworking_id")
        .leftJoin(
          WORKTIME_TABLE,
          "coworkings.id",
          "=",
          "coworking_worktime.coworking_id",
        )
        .select(mainfields)
        .where({ "coworkings.id": id });

      if (!coworkingsData.length) {
        return [];
      }

      const advantages = await advantageModel.getAdvantagesByCoworkingId(
        coworkingsData[0].id,
      );
      const spaces = await spaceModel.getSpacesByCoworkingId(
        coworkingsData[0].id,
      );

      return {
        ...coworkingsData[0],
        spaces,
        advantages,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async getCoworkingsByUser(user_id) {
    try {
      const coworkingsData = await knex(COWORKINGS_TABLE)
        .leftJoin(PRICES_TABLE, "coworkings.id", "=", "prices.coworking_id")
        .leftJoin(
          WORKTIME_TABLE,
          "coworkings.id",
          "=",
          "coworking_worktime.coworking_id",
        )
        .select(mainfields)
        .where({ "coworkings.user_id": user_id });

      if (!coworkingsData[0]) {
        throw ApiError.NotFoundError(user_id);
      }

      const coworkings = await Promise.all(
        coworkingsData.map(async (coworking) => {
          const advantages = await advantageModel.getAdvantagesByCoworkingId(
            coworking.id,
          );
          const spaces = await spaceModel.getSpacesByCoworkingId(coworking.id);
          return { ...coworking, advantages, spaces };
        }),
      );

      return coworkings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async addCoworking(fields) {
    const coworkingData = {
      coworking_name: fields?.coworking_name,
      address: fields?.address,
      phone: fields?.phone,
      email: fields?.email,
      social: fields?.social,
      coworking_photo: fields?.coworking_photo,
      description: fields?.description,
      user_id: fields?.user_id,
      published: fields?.published,
    };
    let pricesData,
      worktimesData,
      advantages = [];

    const trx = await knex.transaction();
    try {
      const coworkingId = await trx(COWORKINGS_TABLE)
        .insert(coworkingData)
        .returning("id");

      if (fields.advantages) {
        const advantagesIdsArray = parseAdvantageIds(fields.advantages);
        const invalidIds = advantagesIdsArray.filter((id) => isNaN(id));
        if (invalidIds.length) {
          throw ApiError.BadRequest("advantages must be an array of integers");
        }

        advantages = await advantageModel.bindAdvantagesToCoworking(
          advantagesIdsArray,
          coworkingId[0].id,
          trx,
        );
      }

      async function insertPrices(data) {
        try {
          pricesData = await trx(PRICES_TABLE)
            .insert({
              ...data,
              coworking_id: coworkingId[0].id,
            })
            .returning(pricesFields);

          return pricesData;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      async function insertWorktimes(data) {
        try {
          worktimesData = await trx(WORKTIME_TABLE)
            .insert({
              ...data,
              coworking_id: coworkingId[0].id,
            })
            .returning(worktimeFields);
          return worktimesData;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      pricesData = await insertPrices({
        first_price: fields?.first_price,
        last_price: fields?.last_price,
        workday: fields?.workday,
        weekend: fields?.weekend,
        hour: fields?.hour,
        amount: fields?.amount,
      });

      worktimesData = await insertWorktimes({
        start_work: fields?.start_work,
        end_work: fields?.end_work,
        work_day_start: fields?.work_day_start,
        work_day_end: fields?.work_day_end,
        dayoff_start: fields?.dayoff_start,
        dayoff_end: fields?.dayoff_end,
      });

      await trx.commit();
      const result = {
        ...coworkingData,
        ...(pricesData ? pricesData[0] : {}),
        ...(worktimesData ? worktimesData[0] : {}),
        id: coworkingId[0].id,
        advantages,
      };
      return result;
    } catch (error) {
      await trx.rollback();
      throw ApiError.IntServError(error.detail);
    }
  },

  async removeCoworking(coworkingId) {
    const trx = await knex.transaction();
    try {
      await trx(SPACES_TABLE).where({ coworking_id: coworkingId }).del();
      await trx(CA_TABLE).where({ coworking_id: coworkingId }).del();
      await trx(WORKTIME_TABLE).where({ coworking_id: coworkingId }).del();
      await trx(PRICES_TABLE).where({ coworking_id: coworkingId }).del();
      await trx(COWORKINGS_TABLE).where({ id: coworkingId }).del();
      await trx.commit();
      return { coworking_id: coworkingId };
    } catch (error) {
      await trx.rollback();
      console.error(error);
      throw error;
    }
  },

  async updateCoworking(fields) {
    let coworkingData, priceData, workTimeData, advantages;
    const trx = await knex.transaction();
    try {
      coworkingData = await trx(COWORKINGS_TABLE)
        .where({ id: fields.id })
        .update({
          coworking_name: fields?.coworking_name,
          address: fields?.address,
          phone: fields?.phone,
          email: fields?.email,
          social: fields?.social,
          coworking_photo: fields?.coworking_photo,
          description: fields?.description,
          user_id: fields?.user_id,
          published: fields?.published,
          updated_at: new Date().toISOString(),
        })
        .returning(coworkingFields);

      const hasPriceChanges = pricesFields.some((field) => field in fields);
      if (hasPriceChanges) {
        priceData = await trx(PRICES_TABLE)
          .where({ coworking_id: fields.id })
          .update({
            first_price: fields?.first_price,
            last_price: fields?.last_price,
            workday: fields?.workday,
            weekend: fields?.weekend,
            hour: fields?.hour,
            amount: fields?.amount,
          })
          .returning(pricesFields);
      }

      const hasWorkTimeChanges = worktimeFields.some(
        (field) => field in fields,
      );
      if (hasWorkTimeChanges) {
        workTimeData = await trx(WORKTIME_TABLE)
          .where({ coworking_id: fields.id })
          .update({
            start_work: fields?.start_work,
            end_work: fields?.end_work,
            work_day_start: fields?.work_day_start,
            work_day_end: fields?.work_day_end,
            dayoff_start: fields?.dayoff_start,
            dayoff_end: fields?.dayoff_end,
          })
          .returning(worktimeFields);
      }

      if (fields.advantages) {
        const advantagesIdsArray = parseAdvantageIds(fields.advantages);

        if (advantagesIdsArray.includes(NaN)) {
          throw ApiError.BadRequest("Advantages must be an array of integers");
        }

        advantages = await advantageModel.bindAdvantagesToCoworking(
          advantagesIdsArray,
          fields.id,
          trx,
        );
      }

      await trx.commit();
      return {
        ...coworkingData[0],
        ...(priceData ? priceData[0] : {}),
        ...(workTimeData ? workTimeData[0] : {}),
        id: fields.id,
        advantages,
      };
    } catch (error) {
      await trx.rollback();
      throw ApiError.IntServError(error.detail);
    }
  },
};
