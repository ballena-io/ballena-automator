import { getNodeUrl } from './chain'
import { strategyABI } from './abi'

const appConfig = {
  secret: process.env.APP_SECRET,
  walletPK: process.env.APP_WKEY,
}

export function getAppSecret(): string | undefined {
  return appConfig.secret
}

export function getAppWalletPK(): string | undefined {
  return appConfig.walletPK
}

export { getNodeUrl, strategyABI }
