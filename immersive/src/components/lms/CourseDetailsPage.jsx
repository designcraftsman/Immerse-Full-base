import React, { useState } from 'react';

const CourseDetailsPage = ({ setCourseData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [environment, setEnvironment] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [skillLevel , setSkillLevel] = useState('');
    

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCourseData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    return (
        <div className="carousel-item active">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg course-card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h3 className="text-center mb-4">Course Details</h3>
                    <form className="course-form">
                        <div className="form-group mb-3">
                            <label htmlFor="title" className="form-label">Course Title <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                placeholder="Enter course title"
                                value={name}
                                onChange={(e) => { setName(e.target.value); handleChange(e); }}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                            <textarea
                                id="description"
                                className="form-control"
                                rows="4"
                                placeholder="Enter course description"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); handleChange(e); }}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="category" className="form-label">Category <span className="text-danger">*</span></label>
                            <select
                                type="text"
                                id="category"
                                className="form-select"
                                placeholder="Enter course category"
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); handleChange(e); }}
                                required
                            >
                                <option value="" selected disabled>Select...</option>
                                <option value="biology"  >Biology</option>
                                <option value="software" >Software</option>
                                <option value="math">Math</option>
                                <option value="mechanics">Mechanics</option>
                                <option value="numeric">Numeric</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="environment" className="form-label">Environment <span className="text-danger">*</span></label>
                            <select
                                type="text"
                                id="environment"
                                className="form-select"
                                placeholder="Enter course environment"
                                value={environment}
                                onChange={(e) => { setEnvironment(e.target.value); handleChange(e); }}
                                required
                                >   
                                    <option value="" selected disabled>Select...</option>
                                    <option value="lab" >Lab</option>
                                    <option value="school" selected>School</option>
                                </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="privacy" className="form-label">Privacy <span className="text-danger">*</span></label>
                            <select
                                type="text"
                                id="privacy"
                                className="form-select"
                                placeholder="Enter course privacy"
                                value={privacy}
                                onChange={(e) => { setPrivacy(e.target.value); handleChange(e); }}
                                required
                            >
                                <option value="" selected disabled>Select...</option>
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="skillLevel" className="form-label">Skill-level <span className="text-danger">*</span></label>
                            <select
                                type="text"
                                id="skillLevel"
                                className="form-select"
                                placeholder="Enter course privacy"
                                value={skillLevel}
                                onChange={(e) => { setSkillLevel(e.target.value); handleChange(e); }}
                                required
                            >
                                <option value="" selected disabled>Select...</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
