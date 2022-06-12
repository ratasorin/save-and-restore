// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Record, RecordDB } from "../../../shared";
import { prisma } from "../../../prisma/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(req.method === "POST")) return res.send(400);
  const record: Record = await JSON.parse(req.body);

  if (!record) {
    console.log("CORRECTLY req.body", req.body);
    return;
  }

  const recordDB: RecordDB = { ...record, state: JSON.stringify(record.state) };
  try {
    await prisma.record.create({ data: recordDB });
    return res.status(201).send({ error: false });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
