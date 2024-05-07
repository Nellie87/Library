import React from 'react';
import Functions from './helpers/functions';

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class My404Component extends React.Component {

    
    
    render() {
       
        return (
            <React.Fragment>
              not found

            </React.Fragment>
        );
    }

}
export default My404Component;
