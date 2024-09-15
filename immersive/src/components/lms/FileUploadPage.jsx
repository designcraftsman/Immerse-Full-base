import { useState } from 'react';

const FileUploadPage = ({ setCourseData }) => {
    const [coursePDF, setCoursePDF] = useState('');
    const [video, setVideo] = useState('');
    const [videoError, setVideoError] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [previewImageSrc, setPreviewImageSrc] = useState(null);
    const [gainedSkills, setGainedSkills] = useState([]);
    const [prerequisites, setPrerequisites] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [prerequisiteInput, setPrerequisiteInput] = useState('');

    const addGainedSkill = () => {
        if (skillInput.trim()) {
            const newSkills = [...gainedSkills, skillInput];
            setGainedSkills(newSkills);
            setSkillInput('');
            setCourseData((prevData) => ({
                ...prevData,
                gainedSkills: newSkills,
            }));
        }
    };

    const addPrerequisite = () => {
        if (prerequisiteInput.trim()) {
            const newPrerequisites = [...prerequisites, prerequisiteInput];
            setPrerequisites(newPrerequisites);
            setPrerequisiteInput('');
            setCourseData((prevData) => ({
                ...prevData,
                prerequisites: newPrerequisites,
            }));
        }
    };

    const previewImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
            setCourseData((prevData) => ({
                ...prevData,
                previewimage: file,
            }));
        }
    };

    const handlePDFChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoursePDF(file);
            setCourseData((prevData) => ({
                ...prevData,
                coursePDF: file,
            }));
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setVideo(file);
                setVideoError('');
                const videoURL = URL.createObjectURL(file);
                setVideoPreview(videoURL);
                setCourseData((prevData) => ({
                    ...prevData,
                    video: file,
                }));
            } else {
                setVideoError('Please upload a valid video file.');
            }
        }
    };

    return (
        <div className="carousel-item">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg course-card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h3 className="text-center mb-4">File Upload</h3>
                    <form className="course-form">
                        <div className="form-group mb-3">
                            <label htmlFor="coursePDF" className="form-label">
                                Course PDF <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                accept="application/pdf,application/vnd.ms-excel"
                                name="coursePDF"
                                id="coursePDF"
                                className="form-control"
                                onChange={handlePDFChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group mb-3">
                            <label htmlFor="video" className="form-label">
                                Upload Video <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                id="video"
                                className="form-control"
                                onChange={handleVideoChange}
                                required
                            />
                            {videoError && <div className="text-danger mt-2">{videoError}</div>}
                            {videoPreview && (
                                <div className="mt-4">
                                    <h5>Video Preview:</h5>
                                    <video controls src={videoPreview} className="img-fluid mt-3" />
                                </div>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="previewimage" className="form-label">Preview Image <span className="text-danger">*</span></label>
                            <input
                                type="file"
                                name="previewimage"
                                id="previewImageInput"
                                className="form-control"
                                onChange={previewImage}
                                required
                            />
                            {previewImageSrc && (
                                <img
                                    src={previewImageSrc}
                                    alt="Preview"
                                    className="img-fluid mt-3"
                                    id="previewImage"
                                />
                            )}
                        </div>

                        {/* Skills and Prerequisites */}
                        <div className="form-group mb-4">
                            <label className="form-label">Gained Skills</label>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Enter a skill"
                                />
                                <button type="button" className="btn btn-dark btn-sm" onClick={addGainedSkill}>
                                    Add Skill
                                </button>
                            </div>
                            <ul className="list-group">
                                {gainedSkills.map((skill, index) => (
                                    <li key={index} className="list-group-item">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label">Prerequisites</label>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={prerequisiteInput}
                                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                                    placeholder="Enter a prerequisite"
                                />
                                <button type="button" className="btn btn-dark btn-sm" onClick={addPrerequisite}>
                                    Add Prerequisite
                                </button>
                            </div>
                            <ul className="list-group">
                                {prerequisites.map((prerequisite, index) => (
                                    <li key={index} className="list-group-item">
                                        {prerequisite}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FileUploadPage;
