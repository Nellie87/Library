import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Slider from "react-slick";
import HomeExploreContentSection from './homeExploreContentSections';
import HomeSearchBar from './homeSearch';
import BrowseBySubject from '../content/common/browseBySubject';
const funcObj = new Functions();
export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            politics_books: {},
            business_books: {},
            search_url: '/dbooks?q=',
            categorywise_contents: {},
            active_category: "Computer science",
            topselling: [],
            newRelease:[],
            kids_corner:[]
        };
    }
   
    componentDidMount() {
        let art_books = funcObj.get_category_books('art');
        let biography_books = funcObj.get_category_books('biography');
        let politics_books = funcObj.get_category_books('politics');
        let business_books = funcObj.get_category_books('business');
        let travel_books = funcObj.get_category_books('travel');


       

        this.setState({
            art_books: art_books,
            politics_books: politics_books,
            business_books: business_books,
            travel_books: travel_books,
            biography_books: biography_books,
        })
        this.theme();
        this.dashboard();
    }
    dashboard() {
        let user = funcObj.getLocalStorage('user');

        let postBodyData = {

        };
        let endPoint = 'get-top-selling';
        funcObj.commonFetchApiCall(postBodyData, endPoint, "GET").then(data => {
            console.log('dashboard response', data)
           
            if (data.code == 200) {
               console.log("topselling data", data.data.top_selling);
                this.setState({
                    newRelease: data.data.newRelease,
                    topselling: data.data.top_selling,
                    kids_corner: data.data.kids_corner,
                });


            } else if (data.code == 201) {

            }
        });
    }
    searchQ(e) {
        let val = '/dbooks?q=' + e.target.value;
        this.setState({
            search_url: val
        });
    }
    theme() {
        let postBodyData = {

        };
        let endPoint = 'get-theme-config';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {
                // console.log(data.data.da);
                console.log("theme configuration ", data.data);
                let theme = JSON.stringify(data.data);
                funcObj.setLocalStorage("themeconfig", theme);
            } else if (data.code == 201) {
            }
        });
    }

    showTabs(e,category){
        this.setState({
            active_category:category.category_name
        });
    }
    render() {
        const { error, isLoaded, data, newRelease, topselling,kids_corner } = this.state;
        console.log('categorywise_contents', this.state.categorywise_contents)
        const art_books = this.state.art_books;
        const travel_books = this.state.travel_books;
        const biography_books = this.state.biography_books;
        const business_books = this.state.business_books;
        const politics_books = this.state.politics_books;
        const CategoryTabs = {
            slidesToShow: 10,
            slidesToScroll: 1,
            autoplay: false,
            infinite: true,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 8,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 6,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 2,
                    }
                }
            ]
        };
        const topsellingSettings = {
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

        const kidscornerSetting = {
            slidesToShow: kids_corner.length > 4 ? 4 : kids_corner.length,
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
                        slidesToShow: kids_corner.length > 3 ? 3 : kids_corner.length,
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
        const topAuthorsScrollSettings = {
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 1,
                    }
                }

            ]
        };


        const categoriesScrollSettings = {
            slidesToShow:8,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 1,
                    }
                }

            ]
        };



        return (

            <React.Fragment>


                <div className="container">
                <div className="home-page-main">
                    <div className="col-md-12">
                    <HomeExploreContentSection />
                        {/* <img src={funcObj.assets_path("/images/library.png")} className="slider-img" /> */}
                        <hr />
                        <div className="">
                            {/* <h3 className="hero-title">Millions Of eBooks Read anytime, on any device </h3> */}
                            {/* <HomeSearchBar /> */}
                        </div>
                    </div>
                    </div>
             
                    <div className="main-section_title mt-4 text-center">
                        Browse by Subject
                    </div>
                    <BrowseBySubject  slidesToShow={8}  bcols={2}  view_all_link="dbooks?q="  />
                    <hr></hr>



                    <div className="row-cards-one dashboard-box">
                        <h3 className="scroll_section_heading">Trending</h3>
                        <Slider id="top_selling" className="top-books" {...topsellingSettings}>
                            {

                                topselling.map(
                                    (selling, index) => {
                                        return (
                                           <React.Fragment>
                                               {funcObj.catalogCardBoxLeftRightList(selling,'home')}
                                           </React.Fragment>
                                        )
                                    }
                                )

                            }


                        </Slider>
                    </div>
                    

                    <div className="row-cards-one dashboard-box">
                        <h3 className="scroll_section_heading">Kids corner</h3>
                        <Slider id="top_selling" className="top-books" {...kidscornerSetting}>
                            {

                                kids_corner.map(
                                    (kid, index) => {
                                        return (
                                           <React.Fragment>
                                               {funcObj.catalogCardBoxLeftRightList(kid,'home')}
                                           </React.Fragment>
                                        )
                                    }
                                )

                            }


                        </Slider>
                    </div>
                    {
                        ( newRelease.length < 0) ?
                            <div className="row-cards-one dashboard-box">

                                <h3 className="dashboard-title title-margin">Popular reads</h3>
                                <Slider id="top_selling" className="top-books" {...topsellingSettings}>
                                    {
                                        newRelease.map(
                                            (selling, index) => {
                                            
                                                return (
                                           <React.Fragment>
                                               {funcObj.catalogCardBoxLeftRightList(selling,'home')}
                                           </React.Fragment>
                                        )
                                            }
                                        )
                                    }


                                </Slider>


                            </div>
                            : null
                    }
                </div>
                {/* <div className="authors-wrap months_authors py-3 py-lg-5 my-3 my-lg-5">
                    <div className="container">
                        <div className="row ">
                            <div className="col-lg-3">
                                <div className="top-authors px-3">
                                    <div className="main-section_title text-white">
                                        Top Authors
                                    </div>
                                    <p className="mt-4 sub-text text-white">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print</p>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <Slider className="top-authors_wrap" {...topAuthorsScrollSettings}>
                                    <div className="author-card">
                                        <Link to="/dbooks?q=">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author1.png")} alt="author" />
                                            </div>
                                        </Link>
                                        <div className="writer px-3 mb-0 mt-3">
                                            Kenyan novelist
                                        </div>
                                        <div className="author-name px-3 mb-2 mt-0 ">
                                            Ngũgĩ wa Thiong’o
                                        </div>
                                    </div>
                                    <div className="author-card">
                                        <Link to="/dbooks?q=">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author2.png")} alt="author" />
                                            </div>
                                        </Link>
                                        <div className="writer px-3 mb-0 mt-3">
                                            Kenyan novelist
                                        </div>
                                        <div className="author-name px-3 mb-2 mt-0 ">
                                            Kinyanjui Kombani
                                        </div>
                                    </div>
                                    <div className="author-card">
                                        <Link to="/dbooks?q=">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author3.png")} alt="author" />
                                            </div>
                                        </Link>
                                        <div className="writer px-3 mb-0 mt-3">
                                            Kenyan novelist
                                        </div>
                                        <div className="author-name px-3 mb-2 mt-0 ">
                                            Ngũgĩ wa Thiong’o
                                        </div>
                                    </div>
                                    <div className="author-card">
                                        <Link to="/dbooks?q=">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author1.png")} alt="author" />
                                            </div>
                                        </Link>
                                        <div className="writer px-3 mb-0 mt-3">
                                            Kenyan novelist
                                        </div>
                                        <div className="author-name px-3 mb-2 mt-0 ">
                                            Ngũgĩ wa Thiong’o
                                        </div>
                                    </div>
                                    <div className="author-card">
                                        <Link to="/dbooks?q=">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author2.png")} alt="author" />
                                            </div>
                                        </Link>
                                        <div className="writer px-3 mb-0 mt-3">
                                            Kenyan novelist
                                        </div>
                                        <div className="author-name px-3 mb-2 mt-0 ">
                                            Kinyanjui Kombani
                                        </div>
                                    </div>
                                    <div className="author-card">
                                        <Link to="/dbooks?q=">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author3.png")} alt="author" />
                                            </div>
                                        </Link>
                                        <div className="writer px-3 mb-0 mt-3">
                                            Kenyan novelist
                                        </div>
                                        <div className="author-name px-3 mb-2 mt-0 ">
                                            Ngũgĩ wa Thiong’o
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <div className="new-section">
                    <div className="container">
                        <div className="main-section_title mt-4 text-center">
                            News & Updates
                        </div>
                        
                        <div className="row">
                            <div className="col-lg-4 pr-lg-0">
                                <div className="news-card">
                                    <img src={funcObj.assets_path("/images/icons/news1.png")} className="w-100" alt="news1" />
                                </div>
                            </div>
                            <div className="col-lg-4  px-lg-0">
                                <div className="news-card">
                                    <div className="new-content p-3 px-xl-4">
                                        <h3 className="dashboard-title  title-margin">It Uses Dictionary of Over</h3>
                                        <p className="sub-text"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown .</p>
                                        <Link to="/dbooks?q=" className="read_more_link">Read More</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 pl-lg-0">
                                <div className="news-card">
                                    <img src={funcObj.assets_path("/images/icons/news2.png")} className="w-100" alt="news1" />
                                </div>
                            </div>
                            <div className="col-lg-4 pr-lg-0">
                                <div className="news-card">
                                    <div className="new-content p-3 px-xl-4">
                                        <h3 className="dashboard-title  title-margin">It Uses Dictionary of Over</h3>
                                        <p className="sub-text"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown .</p>
                                        <Link to="/dbooks?q=" className="read_more_link">Read More</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 px-lg-0">
                                <div className="news-card">
                                    <img src={funcObj.assets_path("/images/icons/news3.png")} className="w-100" alt="news1" />
                                </div>
                            </div>
                            <div className="col-lg-4  pl-lg-0">
                                <div className="news-card">
                                    <div className="new-content p-3 px-xl-4">
                                        <h3 className="dashboard-title  title-margin">It Uses Dictionary of Over</h3>
                                        <p className="sub-text"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown .</p>
                                        <Link to="/dbooks?q=" className="read_more_link">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}



            </React.Fragment>
        );
    }

  
}
