import React from 'react'
import Navbar from '../../components/Navbar';
import InstituteOverview from '../../components/Institute/InstituteOverview';
import InstituteOverviewHeaderContent from '../../components/Institute/InstituteOverviewHeaderContent';
import InstituteOverviewContactInfo from '../../components/Institute/Dashboard/InstituteOverviewContactInfo';
import Footer from '../../components/Footer';

export const InstituteOverviewPage = () => {
  return (
    <div className="w-full min-h-screen">
        <Navbar/>
        <InstituteOverviewHeaderContent/>
        <div className="flex flex-col sm:flex-row h-full">
            <div className="sm:w-[75vw] w-full"><InstituteOverview/></div>
            <div className="sm:w-[25vw] w-full"><InstituteOverviewContactInfo /></div>
        </div>
        <Footer />
    </div>
  )
}
export default InstituteOverviewPage;

