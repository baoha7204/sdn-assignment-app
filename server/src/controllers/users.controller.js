import { DatabaseConnectionError, Jwt, NotFoundError } from "@bhtickix/common";
import Member from "../models/member.model.js";

const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  try {
    // Create search filter
    const searchFilter = search
      ? {
          $and: [
            { isAdmin: false },
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            },
          ],
        }
      : { isAdmin: false };

    // Get users with pagination
    const users = await Member.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalUsers = await Member.countDocuments(searchFilter);

    res.send({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }
};

const putEditProfile = async (req, res) => {
  const { name, YOB, gender } = req.body;
  const user = await Member.findById(req.currentUser.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.name = name;
  user.YOB = YOB;
  user.gender = gender;
  try {
    await user.save();

    // Generate JWT and store it in the session object
    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      YOB: user.YOB,
      gender: user.gender,
    };
    const userJwt = Jwt.sign(userPayload);
    req.session = {
      jwt: userJwt,
    };

    res.send(user);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};

const patchEditPassword = async (req, res) => {
  const { newPassword } = req.body;
  const user = await Member.findById(req.currentUser.id);

  user.password = newPassword;
  try {
    await user.save();
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  res.send(user);
};

export default { putEditProfile, patchEditPassword, getUsers };
