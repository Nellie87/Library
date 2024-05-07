
import React from 'react';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class DRMSettingsDummy extends React.Component {

  
    render() {

        return (
            <React.Fragment>
              <form id="" method="POST" >
               
              <div className="form-group">
                                    <span>Copying and Paste</span>
                                    <div class="custom-checkbox">
                                        <input type="checkbox" id="drm_cp"  checked />
                                        <label for="drm_cp" className=""></label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <span>Printing</span>
                                    <div class="custom-checkbox">
                                        <input type="checkbox" id="drm_printing" />
                                        <label for="drm_printing"></label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <span>Number of devices</span>
                              
                                    <input type="number" name="drm_no_of_devices" className="form-control" defaultValue="1"  />
                                </div>
                                <div className="form-group">
                                    <span>Period of time available to use</span>
                                    
                                   <input type="number" name="drm_period" className="form-control" defaultValue="1"  />
                                </div>

                                <div className="form-group">
                                    <span>Downloads</span>
                                    <div class="custom-checkbox">
                                        <input type="checkbox" id="drm_downloads" />
                                        <label for="drm_downloads"></label>
                                    </div>
                                </div>
                </form>
            </React.Fragment>
        );
    }

  



}
export default DRMSettingsDummy;
