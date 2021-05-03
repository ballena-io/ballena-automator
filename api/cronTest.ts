import { VercelRequest, VercelResponse } from '@vercel/node'
import { appConfig } from '../src/config'

export const time = async (): Promise<{
  time?: number
}> => {
  return {
    time: new Date().getTime(),
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const auth = req.headers.authorization

  if (auth === appConfig.secret) {
    const data = await time()
    res.status(200).send(data)
  }
  return res.status(401).end()
}
