import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma";
import { Record, State } from "../../../shared";

export default async function getRecords(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const recordsDB = await prisma.record.findMany({});
    const records: Record[] = recordsDB.map((r) => ({
      ...r,
      state: JSON.parse(r.state) as State,
    }));

    console.log({ records });

    if (!records.length)
      records.push({
        created_at: new Date(),
        state: { color: "#574888", title: "Welcome back !" },
      });

    res.send(records);
  } catch (err) {
    console.error(err);
    res.send([
      {
        created_at: new Date(),
        state: { color: "#574888", title: "Welcome back !" },
      },
    ]);
  }
}
