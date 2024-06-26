const TokensTable = "tokens";

module.exports = {
  async getUserToken(userId, trx) {
    const data = await trx(TokensTable)
      .select("id", "refreshtoken")
      .where("user_id", "=", userId.userId);
    return data;
  },

  async saveToken(userId, refreshToken, trx) {
    try {
      const userExist = await trx(TokensTable)
        .select("*")
        .where("user_id", "=", userId);
      if (userExist.length) {
        await trx(TokensTable)
          .where("user_id", "=", userId)
          .update({ refreshtoken: refreshToken });
      } else {
        await trx(TokensTable).insert({
          user_id: userId,
          refreshtoken: refreshToken,
        });
      }
      return refreshToken;
    } catch (e) {
      console.error("Помилка транзакції:", e);
      throw e;
    }
  },

  async deleteOneToken(refreshToken, trx) {
    try {
      const data = await trx(TokensTable)
        .where("refreshtoken", refreshToken)
        .del();
      return "logout " + data;
    } catch (e) {
      console.error("Помилка транзакції:", e);
      throw e;
    }
  },

  async findOneToken(refreshToken, trx) {
    const data = await trx(TokensTable)
      .select("user_id", "refreshtoken")
      .where("refreshtoken", refreshToken);
    return data;
  },
};
