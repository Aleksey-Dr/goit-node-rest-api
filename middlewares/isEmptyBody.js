import HttpError from "../helpers/HttpError.js";

export default function isEmptyBody (req, _, next) {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "Body must have at least one field"));
  }
  next();
};