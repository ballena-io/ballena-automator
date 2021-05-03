import random from 'lodash/random'

interface ChainConfig {
  [id: string]: string[]
}

const chainConfig: ChainConfig = {
  '97': [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'https://data-seed-prebsc-2-s1.binance.org:8545/',
    'https://data-seed-prebsc-1-s2.binance.org:8545/',
    'https://data-seed-prebsc-2-s2.binance.org:8545/',
  ],
  '56': [
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/',
  ],
}

export function getNodeUrl(chainId: string): string | undefined {
  const chainNodes = chainConfig[chainId]
  if (chainNodes == undefined) return undefined
  const randomIndex = random(0, chainNodes.length - 1)
  return chainNodes[randomIndex]
}
