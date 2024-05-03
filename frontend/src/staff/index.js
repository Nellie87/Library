import React from 'react';
import PieGraphSection from '../admin/pie_graph_section';
import Slider from "react-slick";
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class StaffDashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            active_graph: '',
            isLoaded: false,
            
        };
    }

    componentDidMount() {
        this.getdashboard();   
    }

    getdashboard() {
        let postBodyData = {
            "filter":this.state.active_graph,
            "from_date":'',
            "to_date":''
        };
        let endPoint = 'admin-dashboard';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (response && response.data && Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    this.setState({
                        isLoaded:true,
                        classes: response.data.classes
                    });
                    
                } else if (response.code == 201) {
                    Swal.fire({
                        title: '',
                        text: response.message,
                        icon: 'error',
                        showConfirmButton: false,
                    })
                }

            })

        });
    }

    render() {

        return (
            <React.Fragment>
                <div>
                    <div className="row row-cards-one dashboard-box">
                        <div className="col-md-12 col-lg-12 col-xl-12">
                            <h3 className="dashboard-title title-margin">Digital Resources</h3>
                        </div>
                        {
                            this.state.classes && Object.keys(this.state.classes).length > 0 ?
                            this.state.classes.map((classd, index) => {
                                let  classname= classd.class_name.replace("/","-");
                                    return (
                                        <div key={index} className="col-md-12 col-lg-6 col-xl-3 mb-4">
                                {/* <Link to={`my-publications?class_id=`+classd.class_id}> */}
                                <div className={`publisher-card `+classname}>
                                    <img src={funcObj.getClassTypeIcons(classname)} className="img-fluid d-block" alt="" />
                                    <h5 className="card-title mt-3">{classd.class_title_p} <span className="d-block number float-right">{classd.total_content_count}</span></h5>
                                </div>
                                {/* </Link> */}
                            </div>
                            )})
                        : null}
                    </div>

                    {/* <PieGraphSection /> */}


                </div>
            </React.Fragment>
        );
    }

    graphSection() {
        const data = {
            labels: ['Video Books', 'Audio Books', 'E-books', 'Slides'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5],
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
        return (
            <div className="row  dashboard-box">
                <div className="col-md-2 mb-4">

                </div>
                <div className="col-md-8 mb-4">
                    <PieGraph pie_data={data} />
                </div>
                <div className="col-md-2 mb-4">

                </div>
            </div>
        );
    }

    popularBooks() {
        return (
            <div className="row row-cards-one dashboard-box">
                <div className="col-md-12 col-lg-12 col-xl-12">
                    <h3 className="dashboard-title title-margin">Popular Books</h3>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
                    <div className="popular-book">
                        <div className="row book-image">
                            <div className="col-md-12">
                                <img src={funcObj.assets_path("/images/books/1.jpg")} className="img-fluid" alt="" />
                            </div>
                        </div>
                        <div className="row book-details">
                            <div className="col-md-12">
                                <h5 className="book-author">Mark Kenyon</h5>
                                <h4 className="book-title">The Wild Country</h4>
                                <h5 className="book-price">$ 63.00</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
                    <div className="popular-book">
                        <div className="row book-image">
                            <div className="col-md-12">
                                <img src={funcObj.assets_path("/images/books/2.jpg")} className="img-fluid" alt="" />
                            </div>
                        </div>
                        <div className="row book-details">
                            <div className="col-md-12">
                                <h5 className="book-author">Mark Kenyon</h5>
                                <h4 className="book-title">The Wild Country</h4>
                                <h5 className="book-price">$ 63.00</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
                    <div className="popular-book">
                        <div className="row book-image">
                            <div className="col-md-12">
                                <img src={funcObj.assets_path("/images/books/3.jpg")} className="img-fluid" alt="" />
                            </div>
                        </div>
                        <div className="row book-details">
                            <div className="col-md-12">
                                <h5 className="book-author">Mark Kenyon</h5>
                                <h4 className="book-title">The Wild Country</h4>
                                <h5 className="book-price">$ 63.00</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
                    <div className="popular-book">
                        <div className="row book-image">
                            <div className="col-md-12">
                                <img src={funcObj.assets_path("/images/books/4.jpg")} className="img-fluid" alt="" />
                            </div>
                        </div>
                        <div className="row book-details">
                            <div className="col-md-12">
                                <h5 className="book-author">Mark Kenyon</h5>
                                <h4 className="book-title">The Wild Country</h4>
                                <h5 className="book-price">$ 63.00</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
