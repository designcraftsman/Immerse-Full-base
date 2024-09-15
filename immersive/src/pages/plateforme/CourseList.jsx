import React from 'react';
import CourseCategroySection2 from '../../components/plateforme/CourseCategorySection2';
import CourseList2 from '../../components/plateforme/CourseList2';
import { useParams } from 'react-router-dom';

const CoursePage = () => {
    const { categorie } = useParams();
    return (
        <div className="container mt-5 ">
            <div className="row pt-5">
                <CourseCategroySection2 categorie={categorie} />
                <CourseList2 categorie={categorie} />
            </div>
        </div>
    );
}

export default CoursePage;
