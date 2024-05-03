import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class FieldsConfiguration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advancefield: [],
            categories: []
        };
        // this.handleChange = this.handleChange.bind(this);
        this.handleOncheckbox = this.handleOncheckbox.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.getconfiguration();
    }

    handleOncheckbox(e, name) {
        const data = {};
        data["field_key"] = name;
        data["field_status"] = (e.target.checked) ? 1 : 0;
        let prv_categories = this.state.categories;
        let index = prv_categories.indexOf(prv_categories.find(el => el.field_key == name))
        if (index > -1) {
            prv_categories[index].field_status = data.field_status
        } else {
            prv_categories.push(data)
        }
        // categories=prv_categories
        console.log(prv_categories);
        this.setState({ categories: prv_categories })

    }
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);
        let postBodyData = {
            categories: this.state.categories
        };
        let endPoint = 'field-configuration';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data)
            if (data.code == 200) {
                this.setState({
                    book_detail: data.data,
                    similar_books: {}
                })
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })

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
    getconfiguration() {
        let postBodyData = {

        };
        let endPoint = 'get-field-configuration';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {
            if (data.code == 200) {
                // console.log(data.data.da);
                this.setState({
                    advancefield: data.data
                });
            } else if (data.code == 201) {
            }
        });
    }
    render() {

        return (
            <React.Fragment>
                <form id="" onSubmit={this.handleSubmit} >
                    <div className="card mt-4">
                        <div className="dashboard-box">

                            <div className="row">
                                <div className="col-lg-12">

                                    <div className="form-head mb-3">
                                        <span className="bg-white d-inline-block px-3">Simple Search fields</span>
                                    </div>
                                    <div className="form-group">


                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox2" disabled checked />
                                            <label for="checkbox2" className="field_disabled">Free text</label>
                                        </div>
                                    </div>

                                    <br />
                                    <div className="form-head mb-3">
                                        <span className="bg-white d-inline-block px-3">Advance Search fields</span>
                                    </div>

                                    <div className="row">
                                        {
                                            this.state.advancefield.map((field, index) => {
                                                let checked = (field.field_status == 1) ? true : false;
                                                return (
                                                    <div key={index} className="col-md-6">
                                                        <div className="form-group">
                                                            <div className="custom-checkbox">
                                                                <input type="checkbox" id={`category_` + field.field_id} value={field.field_id} onChange={(e) => this.handleOncheckbox(e, field.field_key)} defaultChecked={checked} />
                                                                <label htmlFor={`category_` + field.field_id}>{field.field_name}</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                );
                                            })
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                </form>


            </React.Fragment>
        );
    }
}
