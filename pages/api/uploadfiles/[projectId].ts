import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import connectDB from "../../../utils/mongodb";
import corsMiddleware from "../../../utils/corsMiddleware";
import Project from "../../../models/Project";
import { v1 } from 'uuid';

import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  region: 'eu-west-1',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: 'v4'
})

const cors = Cors({
  methods: ["POST"],
  // origin: "http://localhost:3000",
  // origin: "https://newdegenorder.vercel.app",
  origin: "*",
});

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await corsMiddleware(req, res, cors);

  if (req.method === "POST") {
    await connectDB();
    const { projectId } = req.query

    if (!projectId) {
      return res.status(400).send('not ok')
    }

    try {
      const { name, type } = req.body

      const key = `${v1()}-${name}`
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Expires: 600,
        ContentType: type,
        ACL: 'public-read'
      }

      const url = await s3.getSignedUrlPromise('putObject', fileParams)

      await Project.findByIdAndUpdate(projectId, { $push: {
        samples: `https://newdegenorder-projects.s3.eu-west-1.amazonaws.com/${key}`
      }})

      return res.status(200).json({
        url
      })

    } catch (e) {
      return res.status(400).json('not ok')
    }
  } else {
    return res.status(400).json({ error: "No access" });
  }
};

export default handler;
