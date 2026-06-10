import React from 'react';
import Layout from '@theme/Layout';
import CustomFooter from './CustomFooter';

export default function CustomLayout(props) {
  return (
    <Layout {...props}>
      {props.children}
      <CustomFooter />
    </Layout>
  );
}