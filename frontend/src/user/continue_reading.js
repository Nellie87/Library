import React from 'react';
import Functions from '../helpers/functions';
import Slider from "react-slick";

const funcObj = new Functions();
class ContinueReading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reading: [],
        };
    }

    componentDidMount() {
        this.quickread();
    }
   
    quickread() {
        let user = funcObj.getLocalStorage("user");
        console.log(user.user);
        let endPoint = 'quick-read/' + user.user.id;
        let postBodyData = {

        };
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    reading: data.data
                });


            } else if (data.code == 201) {
            }
        });
    }
    render() {
        const bookSettings = {
            slidesToShow: (this.state.reading.length > 4) ? 4 : this.state.reading.length,
            slidesToScroll: 1,
            autoplay: false,
            infinite:false,
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
        let duration = 0;
        return (
                <div>
                {
                    this.state.reading && Object.keys(this.state.reading).length > 0 ?
                    <div>
                    <h3 className="dashboard-title title-margin">Continue Reading</h3>
                  <Slider className="top-books" {...bookSettings}>
                    {
                        this.state.reading && Object.keys(this.state.reading).length > 0 ?
                            this.state.reading.map((book, index) => {

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
                :null
            }
            </div>
                    
          
        );
    }
}
export default ContinueReading;
