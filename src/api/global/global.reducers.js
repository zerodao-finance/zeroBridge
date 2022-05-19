import _ from "lodash";

/**
 * @Reducers
 *
 * DONE: @input
 * DONE: @display
 * DONE: @transactions
 * DONE: @wallet
 * DONE: @zero
 */

function assertNever(x) {
  throw new Error("Unexpected Object", x);
}

export const tokenAddressTable = {
  tokens: {
    renBTC: {
      id: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
    },
    WBTC: {
      id: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
    ibBTC: {
      id: "0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F",
    },
    USDC: {
      id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  },
};

export const globalBridgeState = {
  state: {
    bridge: {
      mode: {
        mode: "transfer", //transfer, release
      },
    },
    transfer: {
      input: {
        amount: "0",
        token: "renBTC",
        slippage: "2.0",
        isFast: false,
        isLoading: false,
        error: null,
      },
      display: {
        ETH: 0,
        renBTC: 0,
      },
      mode: {
        mode: "input",
        gatewayData: {
          address: null,
          requestData: null,
        },
      },
    },
    burn: {
      input: {
        amount: "0",
        destination: "",
        token: "renBTC",
        isLoading: false,
        error: null,
      },
    },
    priceFeeds: {
      data: {
        btc_usd: 0,
        eth_usd: 0,
        btc_eth: 0,
      },
    },
    requests: {
      transfer: new Map(),
      burn: new Map(),
    },
    utilities: {
      ethPrice: 0,
      btcPrice: 0,
      themeMode:
        localStorage.getItem("screenMode") === "light" ? "light" : "dark",
    },
    module: {
      currentModule: "bridge",
      isLoading: false,
      error: null,
    },
    network: {
      provider: null,
      priceFeedContract: null,
    },
    transferRequestCard: {
      confirmations: null,
      status: null,
      isLoading: false,
      error: null,
    },
    transactions: {
      release: [],
      transfer: [],
      currentTX: null,
      isLoading: false,
      error: null,
    },
    wallet: {
      address: null,
      provider: null,
      signer: null,
      network: null,
      chainId: null,
      isLoading: false,
      error: null,
    },
    zero: {
      keepers: [],
      zeroUser: null,
      signer: null,
      controller: null,
      isLoading: false,
      error: null,
    },
    termsAndConditions: {
      tcSigned: false,
    },
  },
  dispatch: (_a) => {},
};

/**
 * @display_requests
 *  effects that require intermediate loading screens
 *  ie. page transitions, data requests etc.
 * @background_processes
 *  state effects that occur in the background and dont require intermediate
 *  display changes
 *  ie.
 */
export const globalBridgeReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      var { module } = action;
      var { effect } = action;
      var { data } = action;
      return {
        ...state,
        [module]: {
          ...state[module],
          [effect]: {
            ...state[module][effect],
            ...data,
          },
        },
      };
    case "RESET":
      var { module } = action;
      var { effect } = action;
      return {
        ...state,
        [module]: {
          ...state[module],
          [effect]: globalBridgeState.state[module][effect],
        },
      };

    case "START_REQUEST":
      return {
        ...state,
        [action.effect]: {
          ...state[action.effect],
          isLoading: true,
          error: null,
        },
      };
    case "SUCCEED_REQUEST":
      return {
        ...state,
        [action.effect]: {
          ...state[action.effect],
          [action.payload.effect]: action.payload.data,
          isLoading: false,
          error: null,
        },
      };
    case "SUCCEED_BATCH_REQUEST":
      return {
        ...state,
        [action.effect]: {
          ...state[action.effect],
          ...action.payload,
          isLoading: false,
          error: null,
        },
      };
    case "FAIL_REQUEST":
      return {
        ...state,
        [action.efffect]: { ...state[action.effect], isLoading: false },
      };
    case "RESET_REQUEST":
      return {
        ...state,
        [action.effect]: { ...globalBridgeState.state[action.effect] },
      };

    case "ADD_DATA":
      //get a map -- data structure
      var map = state[action.module][action.effect];
      map.set(action.payload.key, action.payload.data);
      return {
        ...state,
        [action.module]: { ...action.module, [action.effect]: map },
      };

    case "UPDATE_DATA":
      var key = action.payload.reference;
      var map = state[action.module][action.effect];
      let obj = map.get(key);
      let updated = { ...obj, status: action.payload.update };
      map.set(key, updated);
      return {
        ...state,
        [action.module]: { ...action.module, [action.effect]: map },
      };

    case "UPDATE_WALLET":
      return {
        ...state,
        wallet: {
          ...state["wallet"],
          ...action.data,
        },
      };
    case "UPDATE_TC":
      return {
        ...state,
        termsAndConditions: {
          ...state["termsAndConditions"],
          ...action.data,
        },
      };
    default:
      assertNever(action.type);
  }
};
