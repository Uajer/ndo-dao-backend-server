import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import connectDB from "../../utils/mongodb";
import corsMiddleware from "../../utils/corsMiddleware";
import Project from "../../models/Project";

const cors = Cors({
  methods: ["POST"],
  // origin: "http://localhost:3000",
  origin: "*",
});

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await corsMiddleware(req, res, cors);

  if (req.method === "POST") {
    await connectDB();

    if (req.body.date && req.body.userName && req.body.projectName) {

      if (req.body.projectId) {
        await Project.findByIdAndUpdate(req.body.projectId, {
          date: req.body.date,
          userName: req.body.userName,
          email: req.body.email,
          projectName: req.body.projectName,
          twitterHandle: req.body.twitterHandle,
          nftsCount: req.body.nftsCount,
          drop: req.body.drop,
          discord: req.body.discord,
          website: req.body.website,
        })
        return res.status(201).json({
          _id: req.body.projectId
        })
      } else {

        const project = new Project({
          date: req.body.date,
          userName: req.body.userName,
          email: req.body.email,
          projectName: req.body.projectName,
          twitterHandle: req.body.twitterHandle,
          nftsCount: req.body.nftsCount,
          drop: req.body.drop,
          discord: req.body.discord,
          website: req.body.website,
        });
        const newProject = await project.save()
        return res.status(201).json(newProject)
      }
    } else {
      return res.status(400).json('Error')
    }
  } else {
    return res.status(400).json({ error: "No access" });
  }
};

export default handler;
