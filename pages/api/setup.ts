import { createUsersTable } from "../../app/lib/actions";

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Call the function to create the users table
  await createUsersTable();
  res.status(200).json({ message: "Table created successfully!" });
}
