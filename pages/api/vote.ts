import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import connectDB from "../../utils/mongodb";
import corsMiddleware from "../../utils/corsMiddleware";
import Proposal from "../../models/Proposal";
import Vote from "../../models/Vote";
import axios from 'axios'

const cors = Cors({
  methods: ["POST"],
  origin: "*",
});


// For creating new vote
/*
fetch('/vote', {
  method: 'POST',
  body: JSON.stringify({
    address: 'erd1dnxr9qla5y03qd0q2hq392290aghvvs8fyxkd4kn3t5ggdnhrs9qfs0zxg',
    proposal: '62322699f0264db42d074327',
    vote: 'yes',
  }),
  headers: {
    'Content-Type': 'application/json'
  }
})
*/

const apiAddress = 'https://api.elrond.com';
// const apiAddress = 'https://devnet-api.elrond.com';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await corsMiddleware(req, res, cors);

  if (req.method === "POST") {
    await connectDB();

    try {
      const {
        address,
        proposal,
        vote
      } = req.body

      if (address && proposal && vote) {

        const existingVote = await Vote.findOne({
          address: address,
          proposal: proposal,
        })

        if (existingVote) {
          return res.status(400).send({
            error: true
          })
        } else {
          axios.get(`${apiAddress}/accounts/${address}/nfts/count?collections=NDO-950433`).then(async (nftsResult) => {
            const nftCount = nftsResult?.data;
            if (nftCount && nftCount > 0) {
              const newVote = new Vote({
                address,
                proposal,
                vote,
              });

              await newVote.save()

              const incrementValue = vote === 'yes' ? {
                yesVotes: nftCount || 1
              } : {
                noVotes: nftCount || 1
              }

              const newProposal = await Proposal.findByIdAndUpdate(proposal, {
                $inc: incrementValue
              }, { new: true })

              return res.status(201).json(newProposal)
            } else {
              return res.status(400).json({
                error: true
              })
            }

          }).catch(() => {
            return res.status(400).json({
              error: true
            })
          })
        }

      } else {
        return res.status(400).json({
          error: true
        })
      }
    } catch (e) {
      return res.status(400).json({
        error: true
      })
    }
  } else {
    return res.status(400).json({ error: "No access" });
  }
};

export default handler;
