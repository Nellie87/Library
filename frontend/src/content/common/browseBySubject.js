import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Functions from "../../helpers/functions";
import "../../styles/custom.css"; // Ensure this path is correct

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class BrowseBySubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categorywise_contents: {},
      active_category: "Computer science",
      isOneRow: false, // State to manage layout
    };
  }

  showTabs(e, category) {
    this.setState({
      active_category: category.category_name,
    });
  }

  toggleLayout = () => {
    this.setState((prevState) => ({
      isOneRow: !prevState.isOneRow,
    }));
  };

  async componentDidMount() {
    try {
      const endPoint = "get-contents-categorywise-home";
      let postBodyData = {};

      if (this.props.show_single_row) {
        postBodyData["show_single_row"] = true;
      }

      const data = await funcObj.commonFetchApiCall(postBodyData, endPoint);

      if (data && data.code === 200 && data.data) {
        this.setState({ categorywise_contents: data.data });
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching categorywise contents:", error);
    }
  }

  render() {
    const categoriesScrollSettings = {
      slidesToShow: this.props.slidesToShow,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 3000,
      dots: false,
      pauseOnHover: false,
      centerPadding: "100px",
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 550,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    const { isOneRow, categorywise_contents, active_category } = this.state;

    return (
      <>
        {/* Button to toggle layout */}
        {/* <button
          onClick={this.toggleLayout}
          className="toggle-view-btn d-md-none"
        >
          {isOneRow ? (
            <i className="fas fa-th-large"></i>
          ) : (
            <i className="fas fa-th-list"></i>
          )}
        </button> */}

        <div className="px-3 px-lg-5 category-tabs">
          <Slider className="category_wrap" {...categoriesScrollSettings}>
            {categorywise_contents &&
            Object.keys(categorywise_contents).length > 0 ? (
              categorywise_contents.map((category, index) => {
                let image = category.category_image
                  ? category.category_image
                  : funcObj.assets_path("/images/dummy-category.jpg");
                let active_tab = "";
                if (active_category === category.category_name) {
                  active_tab = "active";
                }
                return (
                  <div className="text-center" key={index}>
                    <img
                      className="cate_icon"
                      src={image}
                      onClick={(e) => this.showTabs(e, category)}
                    />
                    <Link
                      to=""
                      className={`nav-link category-link px-3 py-2 py-lg-5 text-center border-0 ${active_tab}`}
                      onClick={(e) => this.showTabs(e, category)}
                    >
                      {category.category_title_p}
                    </Link>
                  </div>
                );
              })
            ) : null}
          </Slider>
        </div>

        <div className="tab-content" id="myTabContent">
          {categorywise_contents &&
          Object.keys(categorywise_contents).length > 0 ? (
            categorywise_contents.map((category, index) => {
              let default_active = "";
              if (
                category.category_name.toLowerCase() ===
                active_category.toLowerCase()
              ) {
                default_active = "active show";
              }

              return this.looping_books_tab(
                category.contents,
                category,
                index
              );
            })
          ) : null}

          <div className="text-center">
            <button
              className="btn signinBtn sign_in_btn"
              onClick={(e) => funcObj.openUrl(e, this.props.view_all_link)}
            >
              View All &nbsp; <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </>
    );
  }

  looping_books_tab(all_books, category, index) {
    let tab_type = category.category_name;
    console.log("browsebysubject data", all_books.data);
    let default_active = "";
    if (tab_type.toLowerCase() === this.state.active_category.toLowerCase()) {
      default_active = "active show";
    }

    const { isOneRow } = this.state;

    const bookSliderSettings = {
      slidesToShow: 4, // Number of books to show at a time
      slidesToScroll: 1,
      infinite: false,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    return (
      <React.Fragment key={index}>
        <div
          className={`tab-pane fade ${default_active}`}
          id={`cb_${category.category_id}`}
          role="tabpanel"
          aria-labelledby={`tab_area${category.category_id}`}
        >
          <Slider
            className={`books-slider top-categories ${
              isOneRow ? "list-view" : "two-columns"
            }`}
            {...bookSliderSettings}
          >
            {all_books &&
            all_books.data &&
            Object.keys(all_books.data).length > 0
              ? all_books.data.map((content, index) => {
                  return (
                    <React.Fragment key={index}> 
                      {funcObj.catalogCardBoxLeftRightList(content, "home")}
                    </React.Fragment>
                  );
                })
              : null}
          </Slider>
        </div>
      </React.Fragment>
    );
  }
}
