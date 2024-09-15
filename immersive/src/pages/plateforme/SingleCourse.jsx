import React, { useState, useEffect } from 'react';
import { useParams , Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { GrUpdate } from "react-icons/gr";
import CourseCard2 from '../../components/plateforme/CourseCard2';
import person from '../../assets/plateforme/person.png';

const SingleCourse = () => {
  const { idCourse } = useParams();
  const [course, setCourse] = useState({});
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState([]);

  const getCourse = async () => {
    try {
      const response = await fetch(`http://localhost:4200/courses/get/course/${idCourse}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const jsonData = await response.json();
      setCourse(jsonData.course);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const getCourseRatings = async () => {
    try {
      const url = `http://localhost:4200/courseRates/course/${idCourse}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course ratings');
      }

      const jsonData = await response.json();
      setCourseRatings(jsonData.response);
    } catch (error) {
      console.error('Error:', error);
      setCourseRatings([]); // Set course ratings to an empty array on error
    }
  };

  useEffect(() => {
    getCourse();
    getCourses();
    getCourseRatings();
  }, [idCourse]);

  // Handle gainedSkills
  const skillsString = course.gainedSkills;
  const skills = skillsString ? skillsString.split(',').map(skill => skill.trim()) : [];

  // Handle prerequisites
  const prerequisitesString = course.prerequisites;
  const prerequisites = prerequisitesString ? prerequisitesString.split(',').map(prerequisite => prerequisite.trim()) : [];

  // Function to generate star icons based on rating
  const getStarIcons = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5; // True if there should be a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Number of empty stars

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
    }

    // Add half star if needed
    if (halfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }

    return stars;
  };
  function convertDate(date) {
    if (date === undefined || date === null) {
        console.error("Date is undefined or null:", date);
        return null;
    }

    // Handle Date object
    if (date instanceof Date) {
        const datePart = date.toISOString().split('T')[0]; // Convert Date object to ISO string
        return datePart;
    }

    // Convert other types to string and handle valid ISO date strings
    const dateString = date.toString();
    if (dateString.includes('T')) {
        return dateString.split('T')[0]; // Extract date part from ISO string
    } else {
        console.error("Invalid date format:", dateString);
        return null;
    }
}

console.log(convertDate("2024-09-09T23:00:00.000Z")); 
// Output: "2024-09-09"

console.log(convertDate(new Date("2024-09-09T23:00:00.000Z"))); 
// Output: "2024-09-09"

console.log(convertDate(undefined)); 
// Output: "Date is undefined or null: undefined"

console.log(convertDate(null)); 
// Output: "Date is undefined or null: null"

  const limitedCourses = courses.slice(0, 3);
  const totalReviews = courseRatings.length;

  return (
    <div className="container-fluid p-0 m-0 mt-3 pt-5 ">
      <div className="container-fluid " style={{ backgroundColor: "#322936" }}>
        <div className="container">
          <div className="row p-5" style={{ backgroundColor: "#322936" }}>
            <div className="col-8 m-auto text-start text-white">
              <h1 className="text-white mb-3">{course.name}</h1>
              <p className='mb-3'><FaUsers /> {course.totalStudentsEnrolled} students enrolled</p>
              <div className="text-warning mb-3">
                {getStarIcons(course.rating || 0)}
                <span className="text-white"> ({totalReviews || 0} Reviews)</span>
              </div>
              <p>Created By <a className=' text-info  mb-3'>{course.firstName} {course.lastName}</a></p>
              <p><GrUpdate /> Last updated on {convertDate(course.creationDate)}</p>
            </div>
            <div className="col-4 ">
              <img src={course.previewimage} alt="imagee" className="img-fluid rounded shadow" />
            </div>
          </div>
        </div>
      </div>
      <div className='container mt-5'>
        <div className="row">
          <div className="col-lg-7 ">
            <section className="mb-4">
              <h4 className='fw-bold'>About the course</h4>
              <hr className="border-dark" />
              <p>
                {course.description}
              </p>
            </section>

            {/* Skills You'll Gain */}
            <section className="mb-4">
              <hr className="border-dark" />
              <h4 className="fw-bold">Skills you'll gain</h4>
              <ul className="list-inline">
                {skills.map((skill, index) => (
                  <li key={index} className="list-inline-item badge bg-secondary text-white me-2">
                    {skill.toUpperCase()}
                  </li>
                ))}
              </ul>
            </section>
            {/* Enroll now */}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 m-auto" style={{ maxWidth: "300px" }}>
            <div className="card p-4 shadow">
              <h5 className="text-capitalize fw-bold">Instructor</h5>
              <div className="d-flex align-items-center mb-3">
                <img src={course.image} className="rounded-circle shadow" width="50" height="50" alt="Instructor" />
                <div className="ms-3">
                  <h6 className="-normal">{course.firstName} {course.lastName}</h6>
                  <div className="text-warning">
                    {getStarIcons(course.instructorRating || 0)}
                  </div>
                </div>
              </div>
              <h6 className="text-capitalize mt-3 fw-bold">Skill-Level :</h6>
              <p className='underline'>{course.skillLevel}</p>
              <hr className="border-dark" />
              <h6 className="text-capitalize mt-3 fw-bold">Prerequisites :</h6>
              {prerequisites.length === 0 && (
                <p className='underline'>None</p>
              )}
              {prerequisites.length > 0 && (
                <ul>
                  {prerequisites.map((prerequisite, key) => (
                    <li key={key}>{prerequisite}</li>
                  ))}
                </ul>
              )}
              <hr className="border-dark" />
              { course.environment === 'lab' &&(
              <a href={`/immersive-space/labCourse/${course.idCourse}`} className="btn fs-5 w-100 bg-primary text-white shadow fw-bold" style={{ borderColor: '#FF00FF' }}>Enroll Now</a>
            )}{ course.environment === 'school' &&(
              <a href={`/immersive-space/schoolCourse/${course.idCourse}`} className="btn fs-5 w-100 bg-primary text-white shadow fw-bold" style={{ borderColor: '#FF00FF' }}>Enroll Now</a>
            )}
              </div>
          </div>
        </div>
        <div className="container m-auto mt-5">
          <h4 className='fw-bold'>Related Courses</h4>
          <hr className="border-dark" />
          <div className="row ">
            {limitedCourses.length > 0 ? (
              limitedCourses.map((course, index) => (
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
        {/* Learners Reviews */}
        <section className="mb-4 mt-5">
          <h4>Learners Reviews</h4>
          {courseRatings.length > 0 ? (
            courseRatings.map((rating, index) => (
              <div key={index}>
                <hr className="border-dark" />
                <div className="d-flex align-items-center mb-3">
                  <img src={rating.image} className="rounded-circle me-3" width="50" height="50" alt="Student" />
                  <div>
                    <h6 className="mb-0">{rating.firstName} {rating.lastName}</h6>
                    <div className="text-warning">
                      {getStarIcons(rating.rate || 0)}
                    </div>
                    <p>{rating.text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No reviews available for this course.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SingleCourse;
