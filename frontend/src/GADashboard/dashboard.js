import React, { useState } from "react";
import DayVisitsReport from "./dayVisitsReport";
import CountriesReport from "./countriesReport";
import PageviewsReport from "./pageviewReport";
import SourceReport from "./sourceReport";
import BrowsersReport from "./browsersReport";
import DevicesReport from "./devicesReport";
import Header from "../Components/header";
// import { LastRow } from "./styles";

const DashBoard = (props) => {
  const viewID = props.viewId;

  return (
    <div className="card mt-4">
    <div className="dashboard-box">
      <Header />
      {viewID ? (
        <>
          <DayVisitsReport
            metric={"ga:users"}
            title={"Users"}
            viewID={viewID}
          />
          <DayVisitsReport
            metric={"ga:sessions"}
            title={"Sessions"}
            viewID={viewID}
          />
          <CountriesReport viewID={viewID} />
          <PageviewsReport viewID={viewID} />
          <SourceReport viewID={viewID} />
       
            <BrowsersReport viewID={viewID} />
            <DevicesReport viewID={viewID} />
         
        </>
      ) : (
        <h3>No view id defined</h3>
      )}
    </div>
    </div>
  );
};

export default DashBoard;
