import PropTypes from 'prop-types';


export const notificationShape = PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string, // types are : success , warning , danger , dismissible
    message: PropTypes.string,
    time: PropTypes.string,
    date: PropTypes.string,
});

export const settingShape = PropTypes.shape({
    id: PropTypes.number,
    userType: PropTypes.string,
    userId: PropTypes.number,
    twoFactorAuth: PropTypes.bool,
    emailNotification: PropTypes.bool,  // true for on , false for off
    language : PropTypes.string , // eng ,fr 
    theme : PropTypes.string , // dark , light
    recoveryEmailSett :PropTypes.bool, // true for on , false for off
    recoveryEmail :PropTypes.string, // recovery email if recoveryEmailSett is On
});



export const assignmentShape = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
    percentage: PropTypes.number,
    passed: PropTypes.bool
});

export const studentShape = PropTypes.shape({
    id: PropTypes.number,
    profile: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    gender: PropTypes.string,
    birthdate: PropTypes.string ,
    settings : PropTypes.settingShape ,
    notifications : PropTypes.arrayOf(notificationShape)
});

export const teacherShape = PropTypes.shape({
    id: PropTypes.number,
    profile: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    password: PropTypes.string,
    speciality: PropTypes.string,
    email: PropTypes.string,
    gender: PropTypes.string,
    settings : PropTypes.settingShape ,
    notifications : PropTypes.arrayOf(notificationShape)
});

export const courseShape = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
    teacher: PropTypes.string,
    teacherProfile : PropTypes.string,
    previewImg: PropTypes.string,
    type: PropTypes.string, // public or private
    bookmark: PropTypes.bool,  
    category: PropTypes.string  
});
export const messageShape = PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    userid: PropTypes.number,
    time: PropTypes.string,
    date: PropTypes.string,
});

export const groupShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profile: PropTypes.string.isRequired
    })).isRequired,
    chat: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired
    })).isRequired,
    adminId: PropTypes.number.isRequired,
    profile: PropTypes.string
  });

export const assetShape = PropTypes.shape({
    id: PropTypes.number,
    preview: PropTypes.string,
    name: PropTypes.string,
    url : PropTypes.string ,
    description: PropTypes.string,
    type: PropTypes.string,
    format: PropTypes.string
});




// Extraction functions:
export function extractDate(dateTimeString) {
    if (typeof dateTimeString !== 'string') {
        throw new Error('Input must be a string.');
    }
    // Split the string at 'T' and take the first part
    const [date] = dateTimeString.split('T');
    return date;
}

export function extractTime(dateTimeString) {
    if (typeof dateTimeString !== 'string') {
        throw new Error('Input must be a string.');
    }
    // Split the string at 'T' and take the second part, then split at 'Z' if present
    const [, timeWithZone] = dateTimeString.split('T');
    const [time] = timeWithZone.split('Z');
    return time;
}
