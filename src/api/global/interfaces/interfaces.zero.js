import { storeContext } from "../global";
import { useContext, useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { ZeroP2P } from "@zerodao/sdk";
import { test } from "../../utils/zero";
import _ from "lodash";
import PeerId from "peer-id";

const KEEPER = process.env.REACT_APP_TEST
  ? "QmXXKMKno6KXdtTWYkUe3AGXCMEKRnNhFcvPkA2a4roj9Y"
  : "QmNzPmnp9qJia5XwzFteBcZW1BYhcZuCsXVgg8qVp7eovV";

export const useZero = () => {
  const { state, dispatch } = useContext(storeContext);
  const { zero } = state;
  const enableMocks = _.memoize(async () => {});

  useEffect(async () => {
    await enableMocks();
    if (!zero.zeroUser) {
      let user = new ZeroP2P({
        signer: ethers.Wallet.createRandom(),
        multiaddr: test.SIGNALING_MULTIADDR,
        peerId: await PeerId.create(),
      });
      await user.start();
      user.on("keeper", (address) => {
        dispatch({
          type: "SUCCEED_REQUEST",
          effect: "zero",
          payload: {
            effect: "keepers",
            data: [address, ...((zero || {})._keepers || [])],
          },
        });
        keeper = zero._keepers;
      });
      user.emit("keeper", KEEPER);
      user._keepers.push(KEEPER);
      dispatch({
        type: "SUCCEED_REQUEST",
        effect: "zero",
        payload: { effect: "zeroUser", data: user },
      });
    }
  }, []);

  var zeroUser = zero.zeroUser;
  var keeper = (zeroUser || {})._keepers || [];
  return { keeper, zeroUser };
};
