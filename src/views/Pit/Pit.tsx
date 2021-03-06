import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/pit.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import Header from "../../components/Header";
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';
import { Box } from 'react-feather';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Pit: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useTombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(tombFinance?.TBOND);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} TBOND with ${amount} TOMB`,
      });
    },
    [tombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} TBOND` });
    },
    [tombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);

  return (
    <Switch>
      <Page>
        <Header>
          <h5>Buy/Redeem Bonds <span className="fs-6 text-muted"> Earn premiums upon redemption</span></h5>
        </Header>
        {!!account ? (
          <>
            <div className="row row-cols-2" style={{ paddingTop: "30px" }}>
              <ExchangeStat
                tokenName="APX"
                description="Last-Hour TWAP Price"
                price={getDisplayBalance(cashPrice, 18, 4)}
              />
              <ExchangeStat
                tokenName="TBOND"
                description="Current Price: (APX)^2"
                price={Number(bondStat?.tokenInFtm).toFixed(2) || '-'}
              />
            </div>
            <div className="row">
              <ExchangeCard
                action="Purchase"
                fromToken={tombFinance.TOMB}
                fromTokenName="TOMB"
                toToken={tombFinance.TBOND}
                toTokenName="TBOND"
                priceDesc={
                  !isBondPurchasable
                    ? 'TOMB is over peg'
                    : getDisplayBalance(bondsPurchasable, 18, 4) + ' TBOND available'
                }
                onExchange={handleBuyBonds}
                disabled={!bondStat || isBondRedeemable}
              />
              <ExchangeCard
                action="Redeem"
                fromToken={tombFinance.TBOND}
                fromTokenName="TBOND"
                toToken={tombFinance.TOMB}
                toTokenName="TOMB"
                priceDesc={`${getDisplayBalance(bondBalance)} TBOND Available`}
                onExchange={handleRedeemBonds}
                disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                disabledDescription={!isBondRedeemable ? `Enabled when TOMB > ${BOND_REDEEM_PRICE}FTM` : null}
              />
            </div>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

export default Pit;
