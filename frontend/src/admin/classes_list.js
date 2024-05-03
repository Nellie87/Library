import React from 'react';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class ClassesList extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Content Classes</h3>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Class Icon <i className="sort-icon"></i></th>
                                        <th scope="col">Class Name <i className="sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src={funcObj.assets_path("/images/icons/ebook_blue.svg")} className="img-fluid d-block" width="38" alt="" />
                                        </td>
                                        <td>E-Books</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src={funcObj.assets_path("/images/icons/audiobook_blue.svg")} className="img-fluid d-block" width="50" alt="" />
                                        </td>
                                        <td>Audio Books</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src={funcObj.assets_path("/images/icons/videobook_blue.svg")} className="img-fluid d-block" width="38" alt="" />
                                            </td>
                                        <td>Video Books</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src={funcObj.assets_path("/images/icons/slide_blue.svg")} className="img-fluid d-block" width="38" alt="" />
                                        </td>
                                        <td>Slides</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default ClassesList;