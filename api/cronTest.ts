import { VercelRequest, VercelResponse } from '@vercel/node'
import { getAppSecret } from '../src/config'

export const cronTest = async (): Promise<{
  cronTest?: number
}> => {
  return {
    cronTest: new Date().getTime(),
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const auth = req.headers.authorization

  if (auth === getAppSecret()) {
    const data = await cronTest()
    res.status(200).send(data)
  }
  return res.status(401).end()
}
