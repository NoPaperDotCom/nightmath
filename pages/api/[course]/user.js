import { callMethod } from "@/utils/parse";

export default async (req, res) => {
  const _sessionToken = req.query.sessionToken;
  const _course = req.query.course
  const { error, expired } = await callMethod(_course, "verifyUser", { sessionToken: _sessionToken });
  return res.status(200).json({ expired: (error || expired) });
};
