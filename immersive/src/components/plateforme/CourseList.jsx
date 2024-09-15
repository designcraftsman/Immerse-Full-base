import React, { useState , useEffect} from "react";
//import CourseCard2 from "../components/CourseCard2.jsx";
import CourseCard from "../../components/plateforme/CourseCard.jsx"



const categories = [
  "Featured",
  "chemistry",
  "biology",
  "Music",
  "Drawing & Painting",
  "Marketing",
  "Animation",
  "Social Media",
  "UI/UX design",
  "Creative Writing",
  "Digital Illustration",
  "Film & Video",
  "Crafts",
  "Freelance & Entrepreneurship",
  "Graphic Design",
  "Photography",
  "Productivity",
];



const CourseList = () => {
  const [selectedCategory, setSelectedCategory] = useState("Featured");

   const [role, setRole] = useState(null);
    const [courses, setCourses] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
        const storedId = localStorage.getItem('id');
        setId(storedId);
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);


    

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

    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
    };

  const filteredCourses = courses.filter(
    (course) => course.category === selectedCategory || selectedCategory === "Featured"
  );

  return (
    <div className="course-list-container reveal">
      <h2 >Explore Inspiring Online Courses</h2>
      <div className="categories ">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${category === selectedCategory ? "active" : ""}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="courses">
        {filteredCourses.map((course) => (
          <div className="course-card" key={course.idCourse}>
            <CourseCard
              key={course.idCourse}
              id={course.idCourse}
              name={course.name}
              firstName={course.firstName}
              lastName={course.lastName}
              teacherProfile={(course.image)}
              type={course.categorie}
              previewImg={course.previewimage}
              rating={course.rating}
              totalStudentsEnrolled={course.totalStudentsEnrolled}
            />
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default CourseList;


