import PropTypes from 'prop-types';
import { notificationShape } from '../../types/types';
import { useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';


function Notifications() {

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [userId , setId] = useState(null);
    const [userRole , setRole] = useState(null);

    function timeAgo(date, time) {
        // Extract only the date part from the date string (YYYY-MM-DD)
        const datePart = date.split('T')[0]; // "2023-01-01"
        // Extract only the 'HH:mm:ss' part from the time
        const formattedTime = time.split('.')[0]; // "23:14:49"
        // Combine date and time into a valid ISO string
        const isoString = `${datePart}T${formattedTime}`;
        // Create the Date object
        const combinedDateTime = new Date(isoString);
    
        // Check if the date is valid
        if (isNaN(combinedDateTime.getTime())) {
            console.error("Invalid Date constructed:", isoString);
            return "Invalid Date";
        }
        // Current time
        const now = new Date();
        // Calculate the difference in seconds
        const secondsAgo = Math.floor((now - combinedDateTime) / 1000);
        const intervals = {
            year: 31536000,   // seconds in a year
            month: 2592000,   // seconds in a month (30 days)
            week: 604800,     // seconds in a week
            day: 86400,       // seconds in a day
            hour: 3600,       // seconds in an hour
            minute: 60,       // seconds in a minute
            second: 1,        // seconds in a second
        };
        // Determine the appropriate time interval
        for (let [key, value] of Object.entries(intervals)) {
            const interval = Math.floor(secondsAgo / value);
            if (interval >= 1) {
                return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return "just now";
    }
    
    
   useEffect(()=>{
    const storedRole = sessionStorage.getItem('role');
    setRole(storedRole);
   },[]);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
            navigate('/sign-in');
        } else {
            setToken(storedToken);
        }
      }, [navigate]);
    
    
      useEffect(()=>{
        const storedId = sessionStorage.getItem('id');
        setId(storedId);
      },[]);

      const getNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:4200/notifications/get/${userId}/${userRole}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
  
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
  
            const jsonData = await response.json();
            console.log(jsonData.notifications);
            setNotifications(jsonData.notifications);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteNotification = async (idNotification) => {
        try {
            console.log(idNotification);
            const response = await fetch(`http://localhost:4200/notifications/delete/${idNotification}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
  
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const jsonData = await response.json();
            console.log(jsonData.notifications);
        } catch (error) {
            console.error('Error:', error);
        }
    };

      useEffect(() => {
        if (token) {
            getNotifications();
        }
    }, [token]);

    const removeExploreButton = () => {
        let exploreBtn = document.querySelector(".explore-button");
        if (exploreBtn) {
            exploreBtn.style.display = "none";
        }
    };


    useEffect(() => {
        removeExploreButton();
    }, []);

    return (
        <div   className="notifications w-100 mt-3 w-md-100 m-auto">
            <div   className='col-12'>
                {notifications.map((notification, index) => (
                    <div 
                          className={`alert alert-${notification.type.toLowerCase()} fade show small-scale-on-hover border`} 
                        role="alert" 
                        key={index}
                    >
                        <div   className="d-flex justify-content-between">
                            <span><strong>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}:</strong> {notification.message} </span> 
                            <small>{timeAgo(notification.date, notification.time)}</small>
                        </div>
                        <button onClick={() => deleteNotification(notification.idnotification)}
                            type="button" 
                              className="btn-close" 
                            data-bs-dismiss="alert" 
                            aria-label="Close"
                        ></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

Notifications.propTypes = {
    notifications: PropTypes.arrayOf(notificationShape).isRequired,
};
export default Notifications;
