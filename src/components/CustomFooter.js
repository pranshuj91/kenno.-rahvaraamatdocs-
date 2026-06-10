import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function CustomFooter() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <footer className="footer footer--custom">
      {/* Simple Footer with only copyright and company info */}
      <div className="container">
        <div className="footer__simple-content">
          <div className="footer__copyright">
            © 2025 www.rahvaraamat.ee. All rights reserved.
          </div>
          <div className="footer__company-info">
            Rahva Raamat AS, 10421903 • Telliskivi 60/2 (I-building), Tallinn, 15073, Estonia
          </div>
        </div>
      </div>
    </footer>
  );
}