import PropTypes from 'prop-types'
function AssingnementCard(props){
    return(
        <div   className="course-card rounded shadow small-scale-on-hover">
            <div   className="grade">Grade : <span   className="text-success">{props.precentage} %</span> </div>
            <div   className="grade-msg ">Status :  <span   className="link-underline-success">{props.passed ? "passed" : "failed"}</span> </div>
            <h6   className="course-name" >{props.type} Course : {props.name}</h6>
            <p>Course</p>
        </div>
    );
}
AssingnementCard.propTypes = {
    id : PropTypes.number , 
    name : PropTypes.string , 
    precentage : PropTypes.number , 
    type : PropTypes.string , 
    passed : PropTypes.bool
}

AssingnementCard.defaultProps = {
    id : 0 , 
    name : "course name" , 
    precentage : 0 , 
    type : "course type" , 
    state : false
}
export default AssingnementCard

