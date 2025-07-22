import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import InstituteOverview from '../../components/Institute/InstituteOverview';
import InstituteOverviewHeaderContent from '../../components/Institute/InstituteOverviewHeaderContent';
import InstituteOverviewContactInfo from '../../components/Institute/Dashboard/InstituteOverviewContactInfo';
import Footer from '../../components/Footer';

const InstituteOverviewPage = () => {
  const { id } = useParams();

  return (
    <div className="w-full min-h-screen">
      <Navbar />

      {!id && (
        <div className="text-red-500 text-center p-4">
          Warning: Institute ID is missing from the URL.
        </div>
      )}

      <InstituteOverviewHeaderContent id={id} />
      <div className="flex flex-col sm:flex-row h-full">
        <div className="sm:w-[75vw] w-full">
          <InstituteOverview id={id} />
        </div>
        <div className="sm:w-[25vw] w-full">
          <InstituteOverviewContactInfo id={id} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InstituteOverviewPage;
