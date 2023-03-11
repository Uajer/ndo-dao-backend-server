import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import connectDB from "../../utils/mongodb";
import corsMiddleware from "../../utils/corsMiddleware";
import Proposal from "../../models/Proposal";

const cors = Cors({
  methods: ["GET"],
  // origin: "https://newdegenorder.vercel.app",
  origin: "*",
});

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await corsMiddleware(req, res, cors);

  if (req.method === "GET") {
    await connectDB();

    const proposals = await Proposal.find({})

    return res.status(200).json(proposals);

  } else {
    return res.status(400).json({ error: "No access" });
  }
};

export default handler;
