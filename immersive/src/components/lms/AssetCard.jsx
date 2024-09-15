import PropTypes from 'prop-types';
import { assetShape } from '../../types/types.js';
import Y from '../../assets/lms/Y.png';


function AssetCard(props) {
    return (
        <div   className="lms-course-card rounded shadow scale-on-hover">
            <img   className="rounded" src={Y} alt="course preview" />
            <h6   className="course-name mt-2">{props.name}</h6>
            <h6   className="course-name">File type: .{props.format}</h6>
            <p>{props.type}</p>
        </div>
    );
}

AssetCard.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
};

export default AssetCard;

