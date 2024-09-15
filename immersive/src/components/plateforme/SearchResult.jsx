import React, { useState , useEffect } from 'react';
import CourseCard from './CourseCard2';

const CourseList = (props) => {
    const { query } = props;
    const[courses, setCourses] = useState([]);

    const getCourses = async () => {
        try {
            const url = `http://localhost:4200/courses`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const jsonData = await response.json();
            setCourses(jsonData.courses);
        } catch (error) {
            console.error('Error:', error);
            setCourses([]); // Set courses to an empty array on error
        }
    };
    useEffect(() => {
        getCourses();
    }, []);

    // Filter courses based on the search query
    const filteredCourses = query 
        ? courses.filter(course => course.name.toLowerCase().includes(query.toLowerCase()))
        : courses;

    return (
        <div className="col-md-8 mx-auto">
            <h2 className="mb-4">Search Results For : "{query} "</h2>
            <hr className="border border-primary border-3 w-25"/>
            <div className="row">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <CourseCard course={course} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 mt-5 pt-5">
                        <p className="text-center">No courses match your search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseList;
