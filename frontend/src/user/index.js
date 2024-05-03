import React from 'react';
import PieGraph from '../graphs/pie';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Slider from "react-slick";
import Swal from 'sweetalert2';
import BrowseBySubject from '../content/common/browseBySubject';
import ContinueReading from './continue_reading';
import RecentlyAdded from './recently_added';
const funcObj = new Functions();
class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
            content: [],
            audiobooks: [],
            videobooks: [],
            paidcontent: [],
            recommended: []
        };
        this.classload = this.classload.bind(this);
        this.getcatalog = this.getcatalog.bind(this);
    }
    componentDidMount() {
        this.setState({
            ebooks: funcObj.get_category_books('', 'ebooks'),
            recommendEbooks: funcObj.get_category_books('politics', 'ebooks'),
            popularEbooks: funcObj.get_category_books('business', 'ebooks'),

            audiobooks: funcObj.get_category_books('', 'audio'),
            recommendAudio: funcObj.get_category_books('art', 'audio'),
            popularAudio: funcObj.get_category_books('business', 'ebooks'),

            videobooks: funcObj.get_category_books('', 'video'),
            recommendVideo: funcObj.get_category_books('biography', 'video'),
            popularVideo: funcObj.get_category_books('politics', 'ebooks'),

            slides: funcObj.get_category_books('', 'presentations'),
            recommendSlides: funcObj.get_category_books('travel', 'presentations'),
            popularSlides: funcObj.get_category_books('art', 'audio')
        })
      
        this.getcatalog(3);
        this.paidcontent();
        this.recommended();
        this.getClasses();
    }
    paidcontent() {
        let endPoint = 'library-catalog';
        let postBodyData = {
            "page": 1,
            "categories": "",
            "class": "",
            "author": "",
            "publisher": "",
            "isbn": "",
            "content_type": "paid",
            "search_title": ""
        };
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            console.log('paid data response', data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    paidcontent: data.data.catalog
                });

            } else if (data.code == 201) {
            }
        });
    }
  
    classload(e) {

        if (e.target.attributes.getNamedItem("data-id")) {
            const id = e.target.attributes.getNamedItem("data-id").value;
            this.getcatalog(id);
        }


    }
    getcatalog(class_id) {

        let endPoint = 'library-catalog';
        let postBodyData = {
            "page": 1,
            "categories": "",
            "class": class_id,
            "author": "",
            "publisher": "",
            "isbn": "",
            "content_type": "",
            "search_title": ""
        };
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    content: data.data.catalog
                });


            } else if (data.code == 201) {
            }
        });
    }
    popularauthor() {

    }
    getClasses = () => {
        let endPoint = 'get-classes';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    classes: data.data
                });

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    recommended() {
        
        let endPoint = 'recommended-contents';
        let postBodyData = {};
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)
            console.log('Recommended', data);
            if (data.code == 200) {
                console.log(data)
                this.setState({
                    recommended: data.data.catalog
                });


            } else if (data.code == 201) {
            }
        });
    }
    render() {
        const coverBookSettings = {
            slidesToShow: (this.state.content.length > 4) ? 4 : this.state.content.length,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            responsive: [
                {
                    breakpoint: 1500,
                    settings: {
                        slidesToShow: (this.state.content.length > 4) ? 4 : this.state.content.length,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: (this.state.content.length > 3) ? 3 : this.state.content.length,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: (this.state.content.length > 3) ? 3 : this.state.content.length,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: (this.state.content.length > 3) ? 3 : this.state.content.length,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: (this.state.content.length > 2) ? 2 : this.state.content.length,
                    }
                }
            ]
        };
        const recommendedbookSettings = {
            slidesToShow: (this.state.recommended.length > 4) ? 4 : this.state.recommended.length,
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
                        slidesToShow: (this.state.recommended.length > 4) ? 4 : this.state.recommended.length,
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: (this.state.recommended.length > 3) ? 3 : this.state.recommended.length,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: (this.state.recommended.length > 3) ? 3 : this.state.recommended.length,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: (this.state.recommended.length > 2) ? 2 : this.state.recommended.length,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: (this.state.recommended.length > 1) ? 2 : this.state.recommended.length,
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
        const availablebookSettings = {
            slidesToShow: (this.state.paidcontent.length > 4) ? 4 : this.state.paidcontent.length,
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
                        slidesToShow: (this.state.paidcontent.length > 4) ? 4 : this.state.paidcontent.length,
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: (this.state.paidcontent.length > 3) ? 3 : this.state.paidcontent.length,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: (this.state.paidcontent.length > 3) ? 3 : this.state.paidcontent.length,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: (this.state.paidcontent.length > 2) ? 2 : this.state.paidcontent.length,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: (this.state.paidcontent.length > 1) ? 2 : this.state.paidcontent.length,
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
       


        return (
            <React.Fragment>
                <div>
                <div className="row-cards-one dashboard-box">
             
                    <ContinueReading />
                </div>
                    <div className="row-cards-one dashboard-box">
                    
                     

                        
                        {
                                    this.state.recommended && Object.keys(this.state.recommended).length > 0 ?
                        <div className="row-cards-one dashboard-box">
                            <h3 className="dashboard-title title-margin mb-0">Recommended for you</h3>
                            <p className="heading-info title-margin mt-0">
                                {/* Lorem ipsum, or lipsum as it is sometimes known, is dummy text */}
                            </p>
                            <Slider className="top-books" {...recommendedbookSettings}>
                                {
                                    this.state.recommended && Object.keys(this.state.recommended).length > 0 ?
                                        this.state.recommended.map((book, index) => {

                                            return (
                                                <React.Fragment key={index}>
                                                    {funcObj.catalogCardBoxLeftRightList(book, 'reader-dashboard')}
                                                </React.Fragment>
                                            )
                                        })
                                        : null
                                }
                            </Slider>
                        </div>
                        :null}
                                
                                
                        <div className="row-cards-one dashboard-box">
                            <h3 className="dashboard-title title-margin mb-0">Browse by Subject</h3>
                        <BrowseBySubject show_single_row={true} slidesToShow={6} bcols={3} view_all_link="library-catalog" />
                        </div>

                        <div className="row-cards-one dashboard-box">
                            <h3 className="dashboard-title title-margin mb-0">Recently Added</h3>
                                <RecentlyAdded />
                        </div>


                    </div>
                </div>
            </React.Fragment>
        );
    }



  
}
export default UserDashboard;
