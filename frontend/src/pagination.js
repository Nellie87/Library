import React from 'react';
import { Link } from 'react-router-dom';
import Functions from './helpers/functions';

export default class CustomPagination extends React.Component {
    render() {
       
        return (
            <React.Fragment>
                  <nav aria-label="Page navigation">
                  <ul class="pagination text-center mb-0">
                                <li class="page-item"><Link className="page-link" to="#">Previous</Link></li>
                                    <li className="page-item"><Link className="page-link active" to="#">1</Link></li>
                                    <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                    <li className="page-item"><Link className="page-link" to="#">Next</Link></li>
                                </ul>
                            </nav>
            </React.Fragment>
        );
    }
}