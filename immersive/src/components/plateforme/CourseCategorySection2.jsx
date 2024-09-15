import React from 'react';
import { Link } from 'react-router-dom';

const CourseCategorySection2 = ({ categorie }) => {
    // Helper function to determine the active class for the list item and link
    const getClassNames = (category) => {
        return `list-group-item ${categorie === category ? 'active' : ''}`;
    };

    const getLinkClassNames = (category) => {
        return `text-decoration-none ${categorie === category ? 'fw-bold text-white' : 'text-dark'}`;
    };

    return (
        <div className="col-md-3 mt-5 pt-3">
            <ul className="list-group">
                <li className={getClassNames('all')}>
                    <Link to="/courses/all" className={getLinkClassNames('all')}>All courses</Link>
                </li>

                <h5 className="my-3">Technology</h5>
                <ul className="list-group">
                    <li className={getClassNames('web development')}>
                        <Link to="/courses/web development" className={getLinkClassNames('web development')}>Web Development</Link>
                    </li>
                    <li className={getClassNames('data science')}>
                        <Link to="/courses/data science" className={getLinkClassNames('data science')}>Data Science</Link>
                    </li>
                    <li className={getClassNames('artificial intelligence')}>
                        <Link to="/courses/artificial intelligence" className={getLinkClassNames('artificial intelligence')}>Artificial Intelligence</Link>
                    </li>
                    <li className={getClassNames('cybersecurity')}>
                        <Link to="/courses/cybersecurity" className={getLinkClassNames('cybersecurity')}>CyberSecurity</Link>
                    </li>
                </ul>

                <h5 className="my-3">Business</h5>
                <ul className="list-group">
                    <li className={getClassNames('marketing')}>
                        <Link to="/courses/marketing" className={getLinkClassNames('marketing')}>Marketing</Link>
                    </li>
                    <li className={getClassNames('finance')}>
                        <Link to="/courses/finance" className={getLinkClassNames('finance')}>Finance</Link>
                    </li>
                    <li className={getClassNames('project-management')}>
                        <Link to="/courses/project management" className={getLinkClassNames('project-management')}>Project Management</Link>
                    </li>
                </ul>

                <h5 className="my-3">Science</h5>
                <ul className="list-group">
                    <li className={getClassNames('biology')}>
                        <Link to="/courses/biology" className={getLinkClassNames('biology')}>Biology</Link>
                    </li>
                    <li className={getClassNames('chemistry')}>
                        <Link to="/courses/chemistry" className={getLinkClassNames('chemistry')}>Chemistry</Link>
                    </li>
                    <li className={getClassNames('geology')}>
                        <Link to="/courses/geology" className={getLinkClassNames('geology')}>Geology</Link>
                    </li>
                    <li className={getClassNames('physics')}>
                        <Link to="/courses/physics" className={getLinkClassNames('physics')}>Physics</Link>
                    </li>
                </ul>
            </ul>
        </div>
    );
};

export default CourseCategorySection2;
