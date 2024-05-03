import React from 'react';
import { withRouter } from 'react-router-dom';
import Functions from '../helpers/functions';
import Search from "./search";
const funcObj = new Functions();

class PrivateSearch extends React.Component {
    render() {
        let picked_value = this.props.match.params.picked_value;
        console.log('picked_value',picked_value);
       return(
           <Search picked_value={picked_value} />
       );
    }
}
export default withRouter(PrivateSearch);
