import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
} from "@bhtickix/common";
import Perfume from "../models/perfume.model.js";

const getPerfumes = async (req, res) => {};

const getPerfumeDetail = async (req, res) => {
  const { id } = req.params;

  const perfume = await Perfume.findById(id);
  if (!perfume) {
    throw new NotFoundError("Perfume not found");
  }

  res.send(perfume);
};

const postAddPerfume = async (req, res) => {
  const {
    perfumeName,
    uri,
    price,
    concentration,
    description,
    ingredients,
    volume,
    targetAudience,
    brand,
    isActive,
  } = req.body;

  const newPerfume = new Perfume({
    perfumeName,
    uri,
    price,
    concentration,
    description,
    ingredients,
    volume,
    targetAudience,
    brand,
    isActive,
  });

  try {
    await newPerfume.save();
    res.status(201).send(newPerfume);
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

const putEditPefume = async (req, res) => {
  const { id } = req.params;
  const {
    perfumeName,
    uri,
    price,
    concentration,
    description,
    ingredients,
    volume,
    targetAudience,
    brand,
    isActive,
  } = req.body;

  try {
    const updatedPerfume = await Perfume.findByIdAndUpdate(
      id,
      {
        perfumeName,
        uri,
        price,
        concentration,
        description,
        ingredients,
        volume,
        targetAudience,
        brand,
        isActive,
      },
      { new: true }
    );
    res.send(updatedPerfume);
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

const deletePerfume = async (req, res) => {
  const { id } = req.params;
  const perfume = await Perfume.findById(id);

  if (!perfume) {
    throw new NotFoundError("Perfume not found");
  }

  if (perfume.comments.length) {
    throw new BadRequestError(
      "Cannot delete a perfume with comments. Please set active to false instead."
    );
  }

  try {
    await Perfume.findByIdAndDelete(id);
    res.send({});
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

export default {
  getPerfumes,
  getPerfumeDetail,
  postAddPerfume,
  putEditPefume,
  deletePerfume,
};
