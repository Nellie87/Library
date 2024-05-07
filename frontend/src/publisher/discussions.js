import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Discussions extends React.Component {

    constructor() {
        super();
        this.discussions =this.discussions.bind(this);
        this.checkbox =this.checkbox.bind(this);
        this.state = {
            data: []
        };

    }
    componentDidMount() {
        this.discussions();
    }
    discussions() {

        let user = funcObj.getLocalStorage('user');

        let postBodyData = {

        };
        let endPoint = 'get-discussion/' + user.user.id;
        funcObj.commonFetchApiCall(postBodyData, endPoint, "GET").then(data => {
            console.log('dashboard response', data)

            if (data.code == 200) {

                this.setState({
                    isLoaded: true,
                    data: data.data,
                });

            } else if (data.code == 201) {

            }
        });
    }
    checkbox(id) {
        alert(id);
    }
    render() {
        let { data } = this.state;
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Discussions</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-publisher-discussion" className="btn darkBtn">Add Discussion group</Link>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" width="100">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox" />
                                                <label for="checkbox1"></label>

                                            </div>
                                        </th>
                                        <th scope="col" > Topic <i className="sort-icon"></i></th>
                                        <th scope="col" > Created on <i className="sort-icon"></i></th>

                                        <th scope="col" > Total users <i className="sort-icon"></i></th>

                                        <th scope="col"> Status <i className="sort-icon"></i> </th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map(
                                            (group, index) => {
                                                return (<tr>
                                                    <td scope="col" width="100">
                                                        <div class="custom-checkbox">
                                                            <input type="checkbox" id="checkbox"{...group.group_id} />
                                                            <label for="checkbox1"></label>
                                                            <i class="fas fa-edit"></i>
                                                        </div>
                                                    </td>
                                                    <td>{group.topic}</td>
                                                    <td>{group.created_at}</td>
                                                    <td>{group.users}</td>
                                                    {
                                                        (AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader') ?
                                                            <td > Active </td>
                                                            :
                                                            <td >
                                                                <label class="switch">
                                                                    <input type="checkbox" id="switch1" defaultChecked={group.is_blocked} onClick={this.checkbox} />
                                                                    <span class="slider round"></span>
                                                                </label>
                                                            </td>
                                                    }
                                                </tr>
                                                )
                                            }
                                        )
                                    }


                                </tbody>
                            </table>
                        </div>
                        <div className="table-bottom-content">
                            <button type="button" className="btn lightBtn">Delete Selected</button>
                            <nav aria-label="Page navigation">
                                <ul class="pagination text-center mb-0">
                                    <li class="page-item"><a className="page-link" href="#">Previous</a></li>
                                    <li className="page-item"><a className="page-link active" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                            <div className="table__data">
                                Showing  10 of 15
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}