// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { callMethod } from "@/utils/parse";

export default async (req, res) => {
  const _sessionToken = req.query.sessionToken;
  const _course = req.query.course
  const { status, user = { sessionToken: _sessionToken }, products = [] } = await callMethod(_course, "retrieveProducts", { sessionToken: _sessionToken });
  return res.status(200).json({ status, user, products });
}
