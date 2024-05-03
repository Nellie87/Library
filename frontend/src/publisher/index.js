import React from 'react';
import PieGraphSection from './pie_graph_section';
import Slider from "react-slick";
import PieGraph from '../graphs/pie';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from 'sweetalert2';
const funcObj = new Functions();
class PublisherDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: [],
            newRelease: [],
            topselling: [],
            classes: {}
        };

    }
    componentDidMount() {
        this.dashboard();
    }

    dashboard() {
        let user = funcObj.getLocalStorage('user');

        let postBodyData = {

        };
        let endPoint = 'dashboard/' + user.user.id;
        funcObj.commonFetchApiCall(postBodyData, endPoint, "GET").then(data => {
            console.log('dashboard response', data)
            let graph = JSON.stringify(data.data);
            if (data.code == 200) {

                this.setState({
                    isLoaded: true,
                    data: data.data,
                    classes: data.data.classes,
                    newRelease: data.data.newRelease,
                    topselling: data.data.top_selling
                });


            } else if (data.code == 201) {

            }
        });
    }
    render() {
        const { error, isLoaded, data, newRelease, topselling } = this.state;
        const bookSettings = {
            slidesToShow: topselling.length > 4 ? 4 : topselling.length,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: topselling.length > 3 ? 3 : topselling.length,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        };
        const ReleasesSettings = {
            slidesToShow: newRelease.length > 4 ? 4 : newRelease.length,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1500,
                    settings: {
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        };

        console.log('host name:', funcObj.hostname());
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
                                            <Link to={`my-publications?class_id=` + classd.class_id}>
                                                <div className={`publisher-card ` + classname}>
                                                    <img src={funcObj.getClassTypeIcons(classname)} className="img-fluid d-block" alt="" />
                                                    <h5 className="card-title mt-3">{classd.class_title_p} <span className="d-block number float-right">{classd.total_content_count}</span></h5>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                                : null}

                    </div>
                    {this.state.isLoaded === true ? (
                        <PieGraphSection  {...data} />) :
                        (<div>Fetching data from API</div>)

                    }


                    <div className="row-cards-one dashboard-box">
                        <h3 className="dashboard-title title-margin">Top Selling</h3>
                        <Slider id="top_selling" className="top-books" {...bookSettings}>
                            {
                                topselling.map(
                                    (selling, index) => {
                                       
                                        return (
                                          <React.Fragment key={index}>
                                              {funcObj.catalogCardBoxLeftRightList(selling,'publisher-dashboard')}
                                          </React.Fragment>
                                        )
                                    }
                                )
                            }


                        </Slider>
                    </div>
                    <div className="row-cards-one dashboard-box">
                        <h3 className="dashboard-title title-margin">New Releases</h3>
                        <Slider id="new_releases" className="top-books" {...ReleasesSettings}>
                            {
                                newRelease.map(
                                    (release, index) => {
                                     
                                        return (
                                          <React.Fragment key={index}>
                                              {funcObj.catalogCardBoxLeftRightList(release,'publisher-dashboard')}
                                          </React.Fragment>
                                        )
                                    }
                                )
                            }

                        </Slider>
                    </div>


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
export default PublisherDashboard;