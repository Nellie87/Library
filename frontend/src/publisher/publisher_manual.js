import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class ReaderManual extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="feedbackFrm" method="POST">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Publisher Manual</h3>
                            </div>
                            <div className="row">
                               <div className="col-md-12">
                               Manual Content

                               </div>
                            </div>
                            
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
