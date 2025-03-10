import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
} from "@bhtickix/common";

import Brand from "../models/brand.model.js";

const getBrands = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Create query with optional search filter
    const query = search
      ? { brandName: { $regex: search, $options: "i" } }
      : {};

    // Count total results for pagination
    const total = await Brand.countDocuments(query);

    // Fetch paginated results
    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.send({
      brands,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      total,
    });
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};

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

  const existedBrand = await Brand.findOne({
    brandName: {
      $regex: brandName,
      $options: "i",
    },
  });
  if (existedBrand._id.toString() !== id) {
    throw new BadRequestError(
      "Brand already exists! Please input another one."
    );
  }

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
