import * as React from "react";
import Functions from "../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class PrintViewOnsingleContent extends React.PureComponent {
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

                        <th>Profile</th>
                        <th scope="col">Buyer Name <i style={{ display: 'none' }} className="sort-icon"></i></th>
                        {/* <th scope="col">Buyer Mobile <i style={{display:'none'}} className="sort-icon"></i></th>
                                    <th scope="col">Price <i style={{display:'none'}} className="sort-icon"></i></th> */}
                        <th scope="col">Views <i style={{ display: 'none' }} className="sort-icon"></i></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions && Object.keys(transactions).length > 0 ?
                        transactions.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={user.profile_image_path} width="30" alt="books" />
                                            </span>
                                        </td>
                                        {/* <td ><Link to={`/private-bookdetail?book_id=`+user.content_id+`&backlink=views-on-publisher-content`}>{user.title}</Link></td>
                                        <td>{user.subtitle}</td> */}
                                        {/* <td>{user.author_name}</td> */}
                                        <td>{user.first_name} {user.last_name}</td>
                                        {/* <td>{user.mobile}</td>
                                        <td>{user.content_price} {funcObj.getCurrency()}</td> */}
                                        <td>{user.views}</td>
                                    </tr>
                                )
                            }) : null}
                </tbody>
            </table>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return <PrintViewOnsingleContent ref={ref} text={props.text} />;
});
