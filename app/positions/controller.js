import path from "path";
import fs from "fs";

import config_env from "../config.js";
import Positions from "./models.js";

const positionsController = {
  store: async (req, res, next) => {
    try {
      let payload = req.body;
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config_env.rootPath,
          `BACKEND/public/images/positions/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            let positions = new Positions({
              ...payload,
              company_logo: filename,
            });
            await positions.save();
            return res.status(201).json(positions);
          } catch (error) {
            fs.unlinkSync(target_path);
            if (error && error.name === "ValidationError") {
              return res.status(400).json({
                errorNumber: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });

        src.on("error", async () => {
          next(error);
        });
      } else {
        let positions = new Positions(payload);
        await positions.save();
        return res.status(201).json(positions);
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      let payload = req.body;
      const { id } = req.params;
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config_env.rootPath,
          `BACKEND/public/images/positions/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const positionsById = await Positions.findById(id);
            const currentImage = `${config_env.rootPath}/BACKEND/public/images/positions/${positionsById.company_logo}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            const positions = await Positions.findByIdAndUpdate(id, payload, {
              new: true,
              runValidators: true,
            });
            await positions.save();
            return res.status(201).json(positions);
          } catch (error) {
            fs.unlinkSync(target_path);
            if (error && error.name === "ValidationError") {
              return res.status(400).json({
                errorNumber: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });

        src.on("error", async () => {
          next(error);
        });
      } else {
        const positions = await Positions.findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
        });
        await positions.save();
        return res.status(201).json(positions);
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },

  index: async (req, res, next) => {
    try {
      const {
        skip = 0,
        limit = 0,
        title = "",
        description = "",
        location = "",
        type = "",
        page = 1,
      } = req.query;
      let criteria = {};

      if (title.length) {
        criteria = {
          ...criteria,
          title: { $regex: `${title}`, $options: "i" },
        };
      }

      if (description.length) {
        criteria = {
          ...criteria,
          description: { $regex: `${description}`, $options: "i" },
        };
      }

      if (location.length) {
        criteria = {
          ...criteria,
          location: { $regex: `${location}`, $options: "i" },
        };
      }

      if (type) {
        criteria = {
          ...criteria,
          type: true,
        };
      }

      const totalData = await Positions.find(criteria).count();
      const totalPages = Math.ceil(Number(totalData) / Number(limit || 5));
      const positions = await Positions.find(criteria)
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      return res.status(200).json({
        pagination: {
          page: Number(page),
          totalData,
          totalPages,
        },
        data: positions,
      });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },

  detail: async (req, res, next) => {
    const { id } = req.params;
    try {
      const positions = await Positions.findById(id);
      return res.status(200).json(positions);
    } catch (error) {
      if (error && error.name === "CastError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const positionsById = await Positions.findByIdAndDelete(req.params.id);
      const currentImage = `${config_env.rootPath}/BACKEND/public/images/positions/${positionsById.company_logo}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      return res.status(200).json({
        response: "success delete",
        positions_id: positionsById._id,
      });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
};

export default positionsController;
