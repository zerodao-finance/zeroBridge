import fixtures from "zero-protocol/lib/fixtures";
import { ethers } from "ethers";
const { getAddress, isAddress } = ethers.utils;

export const txCardAmount = ({ amount, tokenName }) => {
  const bigNumAmount = ethers.BigNumber.from(amount);

  switch (tokenName ? tokenName.toLowerCase() : "") {
    case "eth":
      return ethers.utils.formatEther(bigNumAmount);
    case "avax":
      return ethers.utils.formatEther(bigNumAmount);
    case "usdc":
      return ethers.utils.formatUnits(bigNumAmount, 6);
    case "usdt":
      return ethers.utils.formatUnits(bigNumAmount, 6);
    default:
      return ethers.utils.formatUnits(bigNumAmount, 8);
  }
};

export const selectFixture = (chainId) => {
  switch (chainId) {
    case "42161":
      return fixtures.ARBITRUM;
    case "43114":
      return fixtures.AVALANCHE;
    case "137":
      return fixtures.MATIC;
    case "10":
      return fixtures.OPTIMISM;
    default:
      return fixtures.ETHEREUM;
  }
};

export const tokenMapping = ({ tokenName, chainId }) => {
  const fixture = selectFixture(chainId);

  switch (tokenName.toLowerCase()) {
    case "avax":
      return ethers.constants.AddressZero;
    case "matic":
      return ethers.constants.AddressZero;
    case "eth":
      return ethers.constants.AddressZero;
    case "renbtc":
      return fixture.renBTC;
    case "wbtc":
      return fixture.WBTC;
    case "ibbtc":
      return fixture.ibBTC;
    case "usdc":
      return fixture.USDC;
    case "usdt":
      return fixture.USDT;
    case "renzec":
      return fixture.renZEC;
  }
};

export const reverseTokenMapping = ({ tokenAddress }) => {
  const checksummedAddress = isAddress(tokenAddress)
    ? getAddress(String(tokenAddress))
    : "";

  const fixture_array = [
    fixtures.ETHEREUM,
    fixtures.ARBITRUM,
    fixtures.AVALANCHE,
    fixtures.OPTIMISM,
  ];
  var tokenName = null;

  fixture_array.forEach((fixture) => {
    if (checksummedAddress == ethers.constants.AddressZero) {
      tokenName = "ETH";
    } else if (checksummedAddress == getAddress(fixture.renBTC)) {
      tokenName = "renBTC";
    } else if (checksummedAddress == getAddress(fixture.WBTC)) {
      tokenName = "WBTC";
    } else if (checksummedAddress == getAddress(fixture.USDC)) {
      tokenName = "USDC";
    } else if (
      fixture == fixtures.ETHEREUM &&
      checksummedAddress == getAddress(fixture.USDT)
    ) {
      tokenName = "USDT";
    } else if (
      fixture == fixtures.ETHEREUM &&
      checksummedAddress == getAddress(fixture.renZEC)
    ) {
      tokenName = "renZEC";
    }
  });

  return tokenName || "unknown";
};

export const available_chains = [1, 42161, 43114, 137, 10];

export const chainIdToName = {
  [1]: "ethereum",
  [42161]: "arbitrum",
  [137]: "matic",
  [43114]: "avalanche",
  [10]: "optimism",
};

const toLower = (s) => s && s.toLowerCase();
const { ETHEREUM, ARBITRUM, AVALANCHE, MATIC, OPTIMISM } = fixtures;

export const DECIMALS = {
  [toLower(ETHEREUM.WBTC)]: 8,
  [toLower(ETHEREUM.renBTC)]: 8,
  [toLower(ETHEREUM.USDC)]: 6,
  [toLower(ETHEREUM.USDT)]: 6,
  [toLower(ETHEREUM.ibBTC)]: 8,
  [toLower(ETHEREUM.renZEC)]: 8,
  [ethers.constants.AddressZero]: 18,
  [toLower(ARBITRUM.WBTC)]: 8,
  [toLower(ARBITRUM.renBTC)]: 8,
  [toLower(ARBITRUM.USDC)]: 6,
  [toLower(ARBITRUM.ibBTC)]: 8,
  [toLower(AVALANCHE.WBTC)]: 8,
  [toLower(AVALANCHE.renBTC)]: 8,
  [toLower(AVALANCHE.USDC)]: 6,
  [toLower(AVALANCHE.ibBTC)]: 8,
  [toLower(MATIC.WBTC)]: 8,
  [toLower(MATIC.renBTC)]: 8,
  [toLower(MATIC.USDC)]: 6,
  [toLower(MATIC.ibBTC)]: 8,
  [toLower(OPTIMISM.WBTC)]: 8,
  [toLower(OPTIMISM.renBTC)]: 8,
  [toLower(OPTIMISM.USDC)]: 6,
  [toLower(OPTIMISM.ibBTC)]: 8,
};

export const selectRemovedTokens = ({ primaryToken, chainId }) => {
  if (primaryToken === "ZEC") {
    return ["renBTC", "ibBTC", "MATIC", "AVAX", "WBTC", "USDC", "USDT", "ZEC"];
  }

  return REMOVED_TOKENS[chainId];
};

export const REMOVED_TOKENS = {
  [1]: ["ibBTC", "AVAX", "MATIC", "renZEC"],
  [42161]: ["ibBTC", "AVAX", "MATIC", "USDT", "ZEC", "renZEC"],
  [137]: ["ibBTC", "AVAX", "ETH", "USDT", "ZEC", "renZEC"],
  [43114]: ["ibBTC", "ETH", "MATIC", "USDT", "ZEC", "renZEC"],
  [10]: [
    "ibBTC",
    "ETH",
    "MATIC",
    "AVAX",
    "WBTC",
    "USDC",
    "USDT",
    "ZEC",
    "renZEC",
  ],
};
