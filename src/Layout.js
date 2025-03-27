import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import title from './img/vtron.png';
import logo1 from './img/paris.png';
import logo2 from './img/london.png';
import logo3 from './img/kansas.png';
import logo4 from './img/rome.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Layout() {
    // Modal Window
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const navigate = useNavigate();

    const toggleModal = () => {
        setShowModal(!showModal); // Toggle modal visibility
    };

    const handleHome = () => {
        navigate('/home');
      }

    return (
        <>
            <div className="container-fluid p-5 my-3">
                <img src={title} onClick={handleHome} className='titlestyl' alt="Title" />
                <img src={logo1} className="imgstyl1" alt="Paris" />
                <img src={logo2} className="imgstyl2" alt="London" />
                <img src={logo3} className="imgstyl3" alt="Kansas" />
                <img src={logo4} className="imgstyl4" alt="Rome" />
            </div>

            <div className="nav123">
                <nav className="navbar navbar-expand-sm navbar-light">
                    <div className="container-fluid">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" href="#">Policy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={toggleModal}>Legend</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">About Us</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Modal structure */}
            {showModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-modal="true" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Legend</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={toggleModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Here goes the legend content.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <Outlet />
        </>
    );
}

export default Layout;
