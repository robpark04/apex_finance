import React from 'react';
import styled from 'styled-components';

import { Card } from '@material-ui/core';

interface ExchangeStatProps {
  tokenName: string;
  description: string;
  price: string;
}

const ExchangeStat: React.FC<ExchangeStatProps> = ({ tokenName, description, price }) => {
  return (
    <div className="col m-b-sm">
      <ul className="list-group st-pricing-table card-bg">
          <li className="list-group-item">
              <h3 className="st-pricing-table-header fs-6">💰 {tokenName} = {price} FTM</h3>
              <hr/>
              <p>{description}
              </p>
          </li>
      </ul>
    </div>
  );
};

const StyledCardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledDesc = styled.span`
  //color: ${(props) => props.theme.color.grey[300]};
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px;
`;

export default ExchangeStat;
