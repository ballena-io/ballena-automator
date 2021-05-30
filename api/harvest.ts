import { VercelRequest, VercelResponse } from '@vercel/node'
import { BigNumber, ethers } from 'ethers'
import { getAppSecret, getAppWalletPK, getNodeUrl, erc20ABI, strategyABI } from '../src/config'

export const harvest = async (
  chainId: string,
  earnedAddress: string,
  address: string,
  min: string,
): Promise<{
  status: number
  time?: number
  chainId?: string
  earnedAddress?: string
  address?: string
  tx?: string
  earned?: string
}> => {
  const provider = new ethers.providers.JsonRpcProvider(getNodeUrl(chainId))
  const walletKey = getAppWalletPK()
  if (walletKey === '')
    return {
      status: 501,
    }
  const wallet = new ethers.Wallet(walletKey, provider)
  const earnedToken = new ethers.Contract(earnedAddress, erc20ABI, wallet)
  const received: BigNumber = await earnedToken.balanceOf(address)
  const strat = new ethers.Contract(address, strategyABI, wallet)
  const pending: BigNumber = await strat.pendingEarnedToken()
  const total = received.add(pending)
  let minimum = BigNumber.from(0)
  if (min !== undefined) {
    minimum = BigNumber.from(`${min}000000000000000000`)
  }
  if (total.gte(minimum)) {
    // Call harvest
    const tx = await strat.harvest({ gasLimit: 975000 })
    return {
      status: 200,
      time: new Date().getTime(),
      chainId,
      earnedAddress,
      address,
      tx: tx.hash as string,
    }
  }
  // Skip harvest call
  return {
    status: 200,
    time: new Date().getTime(),
    chainId,
    earnedAddress,
    address,
    earned: `${total.toString()} of ${minimum.toString()}`,
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const auth = req.headers.authorization

  // Check valid APP_SECRET
  if (auth === getAppSecret()) {
    // Read parameters
    const chainId = req.query['chainId'] as string
    const earnedAddress = req.query['earnedAddress'] as string
    const address = req.query['address'] as string
    const min = req.query['min'] as string
    // Check all parameters OK
    if (chainId === undefined || earnedAddress === undefined || address === undefined) {
      // Bad request
      return res.status(400).end()
    }
    // Make process and get return data
    const data = await harvest(chainId, earnedAddress, address, min)
    // Send data and end connection
    res.status(data.status).send(data).end()
  }
  // Unauthorized
  return res.status(401).end()
}
