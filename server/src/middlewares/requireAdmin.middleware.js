import { NotFoundError, UnauthorizedError } from "@bhtickix/common";
import Member from "../models/member.model.js";

// Pre-requisite: Need to run currentUser and requireAuth middleware before this middleware
export const requireAdmin = async (req, _, next) => {
  const user = await Member.findById(req.currentUser.id);
  if (!user) throw new NotFoundError("User not found");
  if (!user.isAdmin)
    throw new UnauthorizedError("User not authorized to access this route");

  next();
};
