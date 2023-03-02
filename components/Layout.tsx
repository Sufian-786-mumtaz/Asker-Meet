import React from 'react';
import MainLogo from '../pages/assets/MainLogo';
import styled from 'styled-components';
import DescriptionSection from './DescriptionSection';

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutWrapper = styled.div`
  background-color: #f9fbfe;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutWrapper className="main__bold w-screen min-h-screen flex flex-col relative">
      <div className="w-100 h-12 md:h-16 flex flex-row justify-center  pt-3">
        <MainLogo className=" max-h-full w-auto" />
      </div>
      {children}
      
    </LayoutWrapper>
  );
};

export default Layout;
