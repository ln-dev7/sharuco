import { NextApiRequest, NextApiResponse } from 'next';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const userToken: string = req.body?.userToken;
  const code: string = req.body?.code;
  // should be infered from the file extension from the vsCode extension
  const lang: string = req.body?.lang;

  if (userToken === undefined) {
    return res.status(400).json({ error: 'userToken is missing' });
  }

  // TODO: We search the user by it's userToken value
  // (But this can only be done twhen that field will be available on the database for the document user)
  if (userToken === user.userToken){
    // TODO: we create the new code entry for this user
  }

  res.status(200).json({ text: 'Hello' });
}
