import React from 'react';

import AccountButton from '../../components/Nav/AccountButton';
interface HeaderProps {

}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="page-header">
        <nav className="navbar navbar-expand-lg d-flex justify-content-between">
          <div className="header-title flex-fill">
            <a href="#" id="sidebar-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </a>
            {children}
          </div>
          <div className="flex-fill" id="headerNav">
            <ul className="navbar-nav">
            
              <li className="nav-item">
                <AccountButton text="Connect" />
              </li>
            </ul>
          </div>
        </nav>
      </div>
  );
};

export default Header;
