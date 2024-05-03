
import React from 'react';
import LineGraph from '../graphs/line';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
import PieGraphSection from './pie_graph_section';
import DRMTransactionsStatics from "../drm/transactions_statics";
import PieGraphSectionDummy from './pie_graph_section_dummy';
import Swal from "sweetalert2";
const funcObj = new Functions();
class DRMReportDummy extends React.Component {

    constructor() {
        super();
       
    }

 
    render() {

        return (
            <DRMTransactionsStatics />
        );
    }


}
export default DRMReportDummy;