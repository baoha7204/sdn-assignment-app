import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
} from "@bhtickix/common";
import Perfume from "../models/perfume.model.js";

const getPerfumes = (mode) => async (req, res) => {
  const { page = 1, limit = 10, search = "", brandId = "" } = req.query;

  let query = {};
  if (mode === "member") {
    query.isActive = true;
  }

  // Search by perfume name if search term is provided
  if (search) {
    query.perfumeName = { $regex: search, $options: "i" };
  }

  // Filter by brand if brandId is provided
  if (brandId) {
    query.brand = brandId;
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [perfumes, totalCount] = await Promise.all([
      Perfume.find(query)
        .populate("brand", "brandName")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Perfume.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).send({
      perfumes,
      currentPage: parseInt(page),
      totalPages,
      total: totalCount,
    });
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

const getPerfumeDetail = async (req, res) => {
  const { id } = req.params;

  const perfume = await Perfume.findById(id).populate("brand").populate({
    path: "comments.author",
    model: "Member",
    select: "email name",
  });
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

const postAddComment = async (req, res) => {
  const { perfumeId } = req.params;
  const { rating, content } = req.body;

  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) {
    throw new NotFoundError("Perfume not found");
  }

  // Check if user already commented on this perfume
  const existingComment = perfume.comments.find(
    (comment) => comment.author.toString() === req.currentUser.id.toString()
  );

  if (existingComment) {
    throw new BadRequestError("You already commented on this perfume");
  }

  perfume.comments.push({
    rating: parseInt(rating),
    content,
    author: req.currentUser.id,
  });

  try {
    await perfume.save();
    const savedPerfume = await Perfume.findById(perfumeId).populate({
      path: "comments.author",
      model: "Member",
      select: "email name",
    });
    res.status(201).send(savedPerfume);
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

const putEditComment = async (req, res) => {
  const { perfumeId, commentId } = req.params;
  const { rating, content } = req.body;

  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) {
    throw new NotFoundError("Perfume not found");
  }

  const comment = perfume.comments.id(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (comment.author.toString() !== req.currentUser.id.toString()) {
    throw new BadRequestError("You cannot edit other user's comment");
  }

  try {
    comment.rating = parseInt(rating);
    comment.content = content;

    await perfume.save();

    const updatedPerfume = await Perfume.findById(perfumeId).populate({
      path: "comments.author",
      model: "Member",
      select: "email name",
    });

    res.send(updatedPerfume);
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

const deleteComment = async (req, res) => {
  const { perfumeId, commentId } = req.params;

  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) {
    throw new NotFoundError("Perfume not found");
  }

  const comment = perfume.comments.id(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (comment.author.toString() !== req.currentUser.id.toString()) {
    throw new BadRequestError("You cannot edit other user's comment");
  }

  try {
    await Perfume.updateOne(
      {
        _id: perfumeId,
      },
      {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
      }
    );
    // send the perfume that has been updated
    const updatedPerfume = await Perfume.findById(perfumeId).populate({
      path: "comments.author",
      model: "Member",
      select: "email name",
    });
    res.send(updatedPerfume);
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
  postAddComment,
  putEditComment,
  deleteComment,
};
