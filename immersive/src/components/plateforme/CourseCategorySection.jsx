import React, { useState } from 'react';
import CourseCard from './CourseCard';

const CourseCategorySection = ({ category, courses }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedCourses = showAll ? courses : courses.slice(0, 3); // Show only 3 courses initially

  return (
    <div className="category-section mb-5">
      <h2 className="category-title reveal">{category}</h2>
      <div className="underline reveal my-3"></div>
      <div className="row g-3 ">
        {displayedCourses.map((course, index) => (
          <div className="col-md-4 col-sm-6 reveal" key={index}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
      <div className=" mt-4">
        <button className="btn btn-secondary" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>
    </div>
  );
};

export default CourseCategorySection;
