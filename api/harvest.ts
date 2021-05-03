import { VercelRequest, VercelResponse } from '@vercel/node'
import { ethers } from 'ethers'
import { getAppSecret, getAppWalletPK, getNodeUrl, strategyABI } from '../src/config'

export const harvest = async (
  chainId: string,
  address: string,
): Promise<{
  time?: number
  chainId?: string
  address?: string
  tx?: string
}> => {
  const provider = new ethers.providers.JsonRpcProvider(getNodeUrl(chainId))
  const wallet = new ethers.Wallet(getAppWalletPK(), provider)
  const strat = new ethers.Contract(address, strategyABI, wallet)
  const tx = await strat.harvest()
  return {
    time: new Date().getTime(),
    chainId,
    address,
    tx: tx.hash as string,
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const auth = req.headers.authorization

  // Check valid APP_SECRET
  if (auth === getAppSecret()) {
    // Read parameters
    const chainId = req.query['chainId'] as string
    const address = req.query['address'] as string
    // Check all parameters OK
    if (chainId === undefined || address === undefined) {
      // Bad request
      return res.status(400).end()
    }
    // Make process and get return data
    const data = await harvest(chainId, address)
    // Send data and end connection
    res.status(200).send(data).end()
  }
  // Unauthorized
  return res.status(401).end()
}
