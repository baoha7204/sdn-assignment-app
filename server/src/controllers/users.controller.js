import { DatabaseConnectionError, NotFoundError } from "@bhtickix/common";
import Member from "../models/member.model.js";

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
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  res.send(user);
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

export default { putEditProfile, patchEditPassword };
