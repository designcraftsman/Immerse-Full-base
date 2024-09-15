import React, { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Table = ({ columns, data, onDelete, onBan }) => {
  const path = useLocation();
  const page = path.pathname.split('/').filter(Boolean).pop();
  const [token , setToken] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [deleteType , setDeleteType] = useState('');
  const [alert , setAlert] = useState(false);
  const [message , setMessage] = useState(false);
  // State for managing the modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [banIndex, setBanIndex] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
     // Retrieve alert state from localStorage on component mount
     const savedAlert = localStorage.getItem('alert');
     const savedMessage = localStorage.getItem('message');
     if (savedAlert) {
       setAlert(JSON.parse(savedAlert));
       setMessage(savedMessage || '');
     }
  }, []);

  useEffect(() => {
    // Save alert state to localStorage when it changes
    localStorage.setItem('alert', JSON.stringify(alert));
    localStorage.setItem('message', message);
  }, [alert, message]);


  const deleteItem = async (id) => {
    try {
      let response;
      switch (deleteType) {
        case 'students':
          response = await fetch(`http://localhost:4200/students/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          setAlert(true);
          setMessage('Student deleted successfully');
          break;
  
        case 'teachers':
          response = await fetch(`http://localhost:4200/teachers/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          setAlert(true);
          setMessage('Teacher deleted successfully');
          break;
  
        case 'courses':
          response = await fetch(`http://localhost:4200/courses/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          setAlert(true);
          setMessage('Course deleted successfully');
          break;
  
        case 'assets':
          response = await fetch(`http://localhost:4200/assets/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          setAlert(true);
          setMessage('Asset deleted successfully');
          break;
  
        default:
          throw new Error(`Unknown deleteType: ${deleteType}`);
      }
  
      if (!response.ok) {
        throw new Error(`Failed to delete from ${deleteType}`);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const banItem = async (id,type) => {
    try {
          const response = await fetch(`http://localhost:4200/students/suspend/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          setAlert(true);
          setMessage('Student was suspended successfully');
      if (!response.ok) {
        throw new Error(`Failed to delete from ${deleteType}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  

  // Filtered data based on the search query
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      row[col.accessor]
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = (id,type) => {
    setShowDeleteModal(true);
    setDeleteIndex(id);
    setDeleteType(type);
  };
  console.log(deleteType);

  const handleBan = (id,type) => {
    setShowBanModal(true);
    setBanIndex(id);
    setDeleteType(type);
  };

  console.log(banIndex,deleteType);
  const confirmDelete = () => {
    deleteItem(deleteIndex);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const confirmBan = () => {
    banItem(banIndex,deleteType);
    setShowBanModal(false);
  };

  const cancelBan = () => {
    setShowBanModal(false);
    setBanIndex(null);
  };

  const handleDeleteClick = (e, index , type) => {
    e.preventDefault(); // Prevent page refresh
    handleDelete(index,type);
  };

  const handleBanClick = (e, index, type) => {
    e.preventDefault(); // Prevent page refresh
    console.log(e, index, type);
    handleBan(index,type);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="asset-table-container">
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control mb-3"
        />
      </div>
      { alert && (
   
        <div className="alert alert-success alert-dismissible fade show d-flex justify-content-between align-items-center" role="alert">
          {message}
          <a type="button" className="close fs-3 " data-dismiss="alert" aria-label="Close" onClick={() => setAlert(false)} >
            <span aria-hidden="true">&times;</span>
          </a>
        </div>
      
      )}
      <table className="asset-table rounded">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            <th>Delete</th>
            {(page === "students") && <th>Ban</th>}
          </tr>
        </thead>
        <tbody className="rounded">
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col.accessor]}</td>
              ))}
              <td>
              { page === 'students' && (
                <a 
                  className="bg-danger text-light rounded border"
                  onClick={(e) => handleDeleteClick(e,row.idStudent,'students')}
                
                  >
                  <i className="bi bi-trash-fill"></i>
                </a>
              )}
               { page === 'teachers' && (
                <a 
                  className="bg-danger text-light rounded border"
                  onClick={(e) => handleDeleteClick(e,row.idTeacher,'teachers')}
                
                  >
                  <i className="bi bi-trash-fill"></i>
                </a>
              )}
              { page === 'assets' && (
                <a 
                  className="bg-danger text-light rounded border"
                  onClick={(e) => handleDeleteClick(e,row.idAsset,'assets')}
                
                  >
                  <i className="bi bi-trash-fill"></i>
                </a>
              )}
               { page === 'courses' && (
                <a 
                  className="bg-danger text-light rounded border"
                  onClick={(e) => handleDeleteClick(e,row.idCourse,'courses')}
                
                  >
                  <i className="bi bi-trash-fill"></i>
                </a>
              )}
              </td>
              
              {(page === "students") && 
                <td>
                  <a 
                    className="bg-danger text-light rounded border"
                    onClick={(e) => handleBanClick(e, row.idStudent , 'students')}
                  >
                    <i className="bi bi-slash-circle-fill"></i>
                  </a>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span>Per page: </span>
        <select
          className="select-control"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <div className="page-controls text-secondary">
          <button className='custom-button2'
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? 'active custom-button2' : 'custom-button2'}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className='custom-button2'
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for confirming the delete */}
      <div
        className={`modal fade ${showDeleteModal ? 'show d-block' : 'd-none'}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">Confirm Deletion</h5>
            </div>
            <div className="modal-body text-dark">
              <p>Are you sure you want to delete this item?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for confirming the ban */}
      <div
        className={`modal fade ${showBanModal ? 'show d-block' : 'd-none'}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">Confirm Ban</h5>
            </div>
            <div className="modal-body text-dark">
              <p>Are you sure you want to ban this student? They won't be allowed to use the app for 30 days.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelBan}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmBan}
              >
                Ban
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
