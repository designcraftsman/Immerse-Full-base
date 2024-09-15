import React, {useState, useEffect} from 'react';
import CourseCard2 from './CourseCard2';

const CourseList2 = (props) => {
    const { categorie } = props;

    const [role, setRole] = useState(null);
    const [courses, setCourses] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
        const storedId = sessionStorage.getItem('id');
        setId(storedId);
    }, []);

    useEffect(() => {
        const storedRole = sessionStorage.getItem('role');
        setRole(storedRole);
    }, []);


    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const getCourses = async () => {
        try {
            const url = `http://localhost:4200/courses`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

    // Filter courses based on the selected category
    const filteredCourses = categorie === "all" 
        ? courses 
        : courses.filter(course => course.category.toLowerCase() === categorie.toLowerCase());

    return (
        <div className="col-md-8 mx-auto">
            <h2 className="mb-4">Categorie : {categorie === "all" ? "All Courses" : categorie.charAt(0).toUpperCase() + categorie.slice(1)}</h2>
            <hr className="border border-primary border-3 w-25"/>
            <div className="row">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <CourseCard2 course={course} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 mt-5 pt-5">
                        <p className="text-center">No courses available for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseList2;
