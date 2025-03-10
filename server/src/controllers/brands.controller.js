import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
} from "@bhtickix/common";

import Brand from "../models/brand.model.js";

const getBrands = async (req, res) => {};

const getBrandDetail = async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new NotFoundError("Brand not found");
  }

  res.send(brand);
};

const postAddBrand = async (req, res) => {
  const { brandName } = req.body;

  const brand = new Brand({ brandName });

  try {
    await brand.save();
    res.status(201).send(brand);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};

const putEditBrand = async (req, res) => {
  const { id } = req.params;
  const { brandName } = req.body;

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new NotFoundError("Brand not found");
  }

  brand.brandName = brandName;
  try {
    await brand.save();
    res.send(brand);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;

  const isUsed = await Brand.isUsedByPerfumes(id);

  if (isUsed) {
    throw new BadRequestError("Cannot delete brand as it is used by perfumes");
  }

  try {
    await Brand.findByIdAndDelete(id);
    res.send({});
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};

export default {
  getBrands,
  getBrandDetail,
  postAddBrand,
  putEditBrand,
  deleteBrand,
};
