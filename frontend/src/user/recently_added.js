import React from 'react';
import Functions from '../helpers/functions';
import Slider from "react-slick";

const funcObj = new Functions();
class RecentlyAdded extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recently_added: [],
        };
    }

    componentDidMount() {
        this.getContents();
    }
   
    getContents() {
        let endPoint = 'recently-added';
        let postBodyData = {

        };
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
          console.log('recently-added response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    recently_added: data.data
                });


            } else if (data.code == 201) {
            }
        });
    }
    render() {
        const bookSettings = {
            slidesToShow: (this.state.recently_added.length > 4) ? 4 : this.state.recently_added.length,
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
                    this.state.recently_added && Object.keys(this.state.recently_added).length > 0 ?
                    <div>
                  <Slider className="top-books" {...bookSettings}>
                    {
                        this.state.recently_added && Object.keys(this.state.recently_added).length > 0 ?
                            this.state.recently_added.map((book, index) => {

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
export default RecentlyAdded;
