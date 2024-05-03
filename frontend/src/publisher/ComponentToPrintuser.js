import * as React from "react";
import Functions from "../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class ComponentToPrintuser extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { checked: false };
    }

    canvasEl;

    componentDidMount() {
        // const ctx = this.canvasEl.getContext("2d");
        // if (ctx) {
        //   ctx.beginPath();
        //   ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        //   ctx.stroke();
        //   ctx.fillStyle = "rgb(200, 0, 0)";
        //   ctx.fillRect(85, 40, 20, 20);
        //   ctx.save();
        // }
    }

    handleCheckboxOnChange = () =>
        this.setState({ checked: !this.state.checked });

    setRef = (ref) => (this.canvasEl = ref);

    render() {
        const { transactions } = this.props;

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th scope="col" > Name</th>
                        <th scope="col"> Email</th>
                        <th scope="col" > Mobile</th>
                        {/* <th scope="col"> Area Of Intrest <i className="sort-icon"></i> </th> */}
                        <th scope="col">  View More</th>
                        <th scope="col">  Last login</th>
                    </tr>
                </thead>
                <tbody>

                    { transactions.map((value, index) => {
                        // let url= `=`+value.id;
                        let imageurl = (value.profile_image) ? value.profile_image : funcObj.assets_path("/images/icons/dummy-user.png");
                        let book_detail_link = `/logged-in-history?user_id=` + value.id + '&backlink=logged-in-users-reports&username=' + value.first_name + ' ' + value.last_name;
                        let imagestyle = {
                            'borderRadius': '50px'
                        }
                        return (
                            <tr key={index}>
                                <td>
                                    <span className="img-wrap profile__img">
                                        <img src={imageurl} width="40" alt="books" style={imagestyle} />
                                    </span>
                                </td>
                                <td>{value.first_name} {value.last_name}</td>
                                <td>{value.email}</td>
                                <td>{value.mobile}</td>
                                <td><Link to={book_detail_link}>view more</Link></td>
                                {/* <td>
                <span className="dec">
                {value.address}
                </span>
            </td> */}
                                <td>{value.updatedat}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return <ComponentToPrintuser ref={ref} text={props.text} />;
});
