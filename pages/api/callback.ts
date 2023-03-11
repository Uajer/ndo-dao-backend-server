import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "POST") {
    return res.status(200).json({})
  } else {
    return res.status(400).json({ error: "No access" });
  }
};

export default handler;
