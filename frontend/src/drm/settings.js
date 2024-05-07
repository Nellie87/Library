
import React from 'react';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class DRMSettings extends React.Component {

    constructor(props) {
        super(props);
        let content = this.props.content;
        this.state =
            {
              printing:content.printing,
              downloads:content.downloads,
              number_of_devices:content.number_of_devices?content.number_of_devices:0,
              copy_paste:content.copy_paste,
              setting_id:content.setting_id,
            
            };

        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.UpdateDrmSetting = this.UpdateDrmSetting.bind(this);
    }

    handleCheckbox(event) {
        // event.preventDefault();
        if(event.target.checked){
            this.handleSubmit(event.target.name,1);
         }else{
            this.handleSubmit(event.target.name,0);
           
        }
       
  }

    UpdateDrmSetting(event){
        this.handleSubmit(event.target.name,event.target.value);
     }

    handleSubmit(key,val){    
       
        let endPoint = 'update-drm-settings';
        let postBodyData = {[key]:val,setting_id:this.state.setting_id};

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })
                this.setState({[key]:val});
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
            
        });
      
    }

    render() {
        
        return (
            <React.Fragment>
                <form id="" method="POST" >
                    <div className="form-group">
                         <div className="custom-checkbox">
                            <input type="checkbox" id={`drm_cp`+this.state.setting_id} name="copy_paste"   onChange={(e) => this.handleCheckbox(e)}  defaultChecked={this.state.copy_paste == 1 ? true : false}  />
                            <label htmlFor={`drm_cp`+this.state.setting_id} className="">Copying and Paste</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="custom-checkbox">
                            <input type="checkbox" id={`drm_printing`+this.state.setting_id} name="printing" onChange={(e) => this.handleCheckbox(e)}  defaultChecked={this.state.printing == 1 ? true : false}   />
                            <label htmlFor={`drm_printing`+this.state.setting_id}>Printing</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <span>Number of devices</span>
                
                        <input type="number" id={`number_of_devices`+this.state.setting_id} name="number_of_devices" onBlur={(e) => this.UpdateDrmSetting(e)} className="form-control" defaultValue={this.state.number_of_devices}  />
                    </div>
            

                    <div className="form-group">
                        <div className="custom-checkbox">
                            <input type="checkbox" id={`drm_downloads`+this.state.setting_id} name="downloads"  onChange={(e) => this.handleCheckbox(e)}  defaultChecked={this.state.downloads == 1 ? true : false}  />
                            <label htmlFor={`drm_downloads`+this.state.setting_id}>Downloads</label>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        );
    }

  



}
export default DRMSettings;
