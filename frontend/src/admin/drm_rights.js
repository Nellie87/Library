
import React from 'react';

import DRMSettingsDummy from '../drm/settings_dummy';
import LineGraph from '../graphs/line';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';

const funcObj = new Functions();
class DRMRights extends React.Component {

  
    render() {

        return (
            <React.Fragment>
              <form id="" method="POST" >
                <div className="card mt-4">
                    <div className="dashboard-box">
                        
                        <div className="row">
                            <div className="col-lg-6">
                                
                            <div className="form-group">
                                <label className="pl-3">Publishing Content Sources</label>
                                <select  className="input-field form-control">
                              {funcObj.getContentSourcesDropdown()}
                              </select>
                            </div>
                             <DRMSettingsDummy />
       
                </div>
              
                </div>
                        </div>


                </div>
                </form>
            </React.Fragment>
        );
    }

  



}
export default DRMRights;
