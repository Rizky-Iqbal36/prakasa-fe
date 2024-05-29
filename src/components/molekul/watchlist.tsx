import React, { useEffect, useState } from "react";
import {
  Container,
  Divider,
  HeaderWrapper,
  PageTitle,
} from "../../styles/molekul/sidebar.element";

import ButtonAddWatchlist from "../atom/buttonAddWatchlist";

const WatclisthScreen = () => {
  return (
    <Container>
      <HeaderWrapper>
        <PageTitle>Watchlist</PageTitle>
        <ButtonAddWatchlist />
      </HeaderWrapper>
      <Divider />
    </Container>
  );
};

export default WatclisthScreen;
