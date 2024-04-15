const config = require("./../../../config/config");
const { CLIENT_URL } = process.env;
const knex = require("./../../../config/knex.config");
const userService = require("./../../services/user-service");
const userModel = require("./../../models/user-model");
const ApiError = require("./../../exceptions/api-errors");

class UserController {
  async registration(req, res) {
    const trx = await knex.transaction();
    try {
      const { email, password, role } = req.body;

      const userData = await userService.registration(
        email,
        password,
        role,
        trx,
      );
      res.cookie("refreshToken", userData.refreshToken, config.cookieOptions);
      await trx.commit();
      return res.json(userData);
    } catch (error) {
      await trx.rollback();
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async login(req, res) {
    const trx = await knex.transaction();
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password, trx);

      res.cookie("refreshToken", userData.refreshToken, config.cookieOptions);
      trx.commit();
      return res.json(userData);
    } catch (error) {
      trx.rollback();
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async logout(req, res) {
    const trx = await knex.transaction();
    try {
      let { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken, trx);
      res.clearCookie("refreshToken");
      await trx.commit();
      return res.json(token);
    } catch (error) {
      await trx.rollback();
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async activate(req, res) {
    const trx = await knex.transaction();
    try {
      const activationLink = req.params.link;

      const email = await userService.activate(activationLink, trx);

      trx.commit();

      return res.redirect(`${CLIENT_URL}/?email=${email}`);
    } catch (error) {
      trx.rollback();
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async refresh(req, res) {
    const trx = await knex.transaction();
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken, trx);
      res.cookie("refreshToken", userData.refreshToken, config.cookieOptions);
      trx.commit();
      return res.json(userData);
    } catch (error) {
      trx.rollback();
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async getUser(req, res) {
    const user = req.user;
    try {
      let response;
      if (req?.query?.id) {
        response = await userService.getUser(req.query.id);
        if (user.id === response.id) {
          return res.json(response);
        } else {
          return res.send(ApiError.AccessDeniedForRole("User not owner"));
        }
      }
    } catch (error) {
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else if (error.status === 404) {
        return res.json(ApiError.NotFound(`id: ${req.query.id} was not found`));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async editUser(req, res) {
    const fields = req.body;

    const userDataBase = await userModel.findUserByEmailWithHash(fields.email);
    if (!userDataBase) {
      return res.json(
        ApiError.NotFound(`user with email: ${fields.email} was not found`),
      );
    }

    let updatedUser = {};
    if (fields?.password) {
      fields.password = await userService.hashPassword(fields.password);
    }
    const payload = {
      id: userDataBase.id,
      email: fields.email,
      password: fields?.password ?? userDataBase.password,
      name: fields?.name ?? userDataBase.name,
      surname: fields?.surname ?? userDataBase.surname,
      phone: fields?.phone ?? userDataBase.phone,
      role: fields?.role ?? userDataBase.role,
      activationlink: fields?.activationlink ?? userDataBase.activationlink,
      isactivated: fields?.isactivated ?? userDataBase.isactivated,
      updated_at: new Date().toISOString(),
    };

    const userData = req.user;
    try {
      if (userData.role === "admin") {
        updatedUser = await userModel.editUser(payload);
        return res.status(200).json(updatedUser);
      } else if (userData.id === userDataBase.id) {
        payload.role = userDataBase.role;
        payload.activationlink = userDataBase.activationlink;
        payload.isactivated = userDataBase.isactivated;
        updatedUser = await userModel.editUser(payload);
        return res.status(200).json(updatedUser);
      } else {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.user_id;

    const userDataBase = await userModel.findUserById(userId);
    if (!userDataBase) {
      return res.json(
        ApiError.NotFound(`user with email: ${userId} was not found`),
      );
    }

    let response;
    try {
      const role = req.user.role;
      if (role === "admin") {
        response = await userModel.deleteUser(userId);
        return res.status(200).json(response);
      } else {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  }
}

module.exports = new UserController();
