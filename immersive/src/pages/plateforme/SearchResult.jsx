import React from 'react';
import CourseCategorySection2 from '../../components/plateforme/CourseCategorySection2';
import SearchResult from '../../components/plateforme/SearchResult';
import { useParams } from 'react-router-dom';

const CoursePage = () => {
    const { query } = useParams();
    console.log(query);
    return (
        <div className="container mt-5 ">
            <div className="row pt-5">
                <CourseCategorySection2 />
                <SearchResult query={query} />
            </div>
        </div>
    );
}

export default CoursePage;
