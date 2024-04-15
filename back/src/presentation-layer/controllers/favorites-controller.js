const ApiError = require("../../exceptions/api-errors");
const favoriteModel = require("../../models/favorite-model");

module.exports = {
  async createFavoriteSpace(req, res) {
    const userId = req.user.id;
    const spaceId = req.query.spaceId;
    try {
      const [response] = await favoriteModel.createFavoriteSpace(
        userId,
        spaceId,
      );
      if (response) {
        return res.status(200).json({
          message: `SpaceId: ${spaceId} add to favorite-list of userId: ${userId}`,
          ...response,
        });
      }
    } catch (error) {
      console.error(error);
      if (error.code === "23505") {
        return res.json(ApiError.BadRequest(error.detail));
      } else {
        return res.json(ApiError.IntServError(error.detail));
      }
    }
  },

  async getFavoritesSpacesByUserId(req, res) {
    const userId = req.user.id;
    try {
      const response = await favoriteModel.getFavoritesByUserId(userId);
      if (response.length) {
        return res.status(200).json(response);
      } else {
        return res.json(
          ApiError.NotFound(
            `User with id: ${userId} does not have favorite-spaces yet`,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  },

  async updateFavoritesByUserId(req, res) {
    const userId = req.user.id;
    const spaceIds = req.body.spaceIds;
    try {
      const response = await favoriteModel.updateFavoriteSpaces(
        userId,
        spaceIds,
      );
      if (response) {
        return res.status(200).json(response);
      }
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  },

  async deleteFavoriteBySpaceId(req, res) {
    const userId = req.user.id;
    const spaceId = req.query.spaceId;
    try {
      const deletedRow = await favoriteModel.deleteFavoriteBySpaceId(
        userId,
        spaceId,
      );
      if (deletedRow) {
        return res.status(200).json({
          message: `SpaceId: ${spaceId} delete from favorite-list of userId: ${userId}`,
        });
      } else {
        return res.json(ApiError.NotFound("No records found to delete."));
      }
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  },
};
