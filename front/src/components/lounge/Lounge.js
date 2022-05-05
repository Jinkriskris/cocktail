import React, { useState } from "react";
import LoungeList from "./LoungeList";
import LoungeRank from "./LoungeRank";
import useUserHook from "../commons/useUserHook";
import * as Api from "../../api";

//style
import styles from "../../scss/Lounge.module.scss";
import { style } from "@mui/material/node_modules/@mui/system";

function Lounge() {
  const userState = useUserHook();
  const user = userState.user;
  console.log(user);

  return (
    <>
      <div className={styles["lounge-rank-background"]}>
        <LoungeRank />
      </div>
      <div>
        <LoungeList user={user} />
      </div>
    </>
  );
}

export default Lounge;
