    import React, { useState } from 'react';

    const AdditionalAssetsPage = ({ setCourseData }) => {
        const [assets, setAssets] = useState([]);

        // Function to determine file input accept attribute based on asset type
        const getAcceptAttribute = (type) => {
            switch(type) {
                case 'audio':
                    return 'audio/*'; // Accepts all audio files
                case '3d-model':
                    return '.obj,.gltf,.glb'; // Accepts .obj and .gltf files
                default:
                    return '';
            }
        };

        const handleInputChange = (index, e) => {
            const { name, value, files } = e.target;
            const newAssets = [...assets];
            if (name === 'file') {
                newAssets[index][name] = files[0];
            } else {
                newAssets[index][name] = value;
            }
            setAssets(newAssets);
            setCourseData((prevData) => ({
                ...prevData,
                additionalAssets: newAssets,
            }));
        };

        const handleAddAsset = () => {
            setAssets([...assets, { name: '', type: '', file: '' }]);
        };

        return (
            <div className="carousel-item" id="additionalAssetsPage">
                <div className="container d-flex justify-content-center align-items-center min-vh-100">
                    <div className="card p-4 shadow-lg course-card" style={{ width: '100%', maxWidth: '600px' }}>
                        <h3 className="text-center mb-4">Additional Assets</h3>
                        <form className="course-form">
                            {assets.map((asset, index) => (
                                <div key={index} className="form-group mb-3">
                                    <label htmlFor={`assetName-${index}`} className="form-label">
                                        Asset name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id={`assetName-${index}`}
                                        name="name"
                                        className="form-control"
                                        value={asset.name}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                    
                                    <label htmlFor={`assetType-${index}`} className="form-label">
                                        Asset Type <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id={`assetType-${index}`}
                                        name="type"
                                        className="form-select"
                                        value={asset.type}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    >
                                        <option value="">Select asset type</option>
                                        <option value="audio">Audio</option>
                                        <option value="3d-model">3D model (.obj, .gltf)</option>
                                    </select>

                                    <label htmlFor={`assetFile-${index}`} className="form-label">
                                        Asset File <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        id={`assetFile-${index}`}
                                        name="file"
                                        className="form-control"
                                        accept={getAcceptAttribute(asset.type)} // Dynamically set accept attribute
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                </div>
                            ))}
                            <button type="button" className="btn custom-button2 px-5" onClick={handleAddAsset}>
                                + Add Asset
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    export default AdditionalAssetsPage;
