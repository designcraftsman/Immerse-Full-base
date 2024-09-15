import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { assetShape } from '../../types/types.js';
import AssetCard from '../../components/lms/AssetCard.jsx';
import AssetModal from '../../components/lms/AssetModal.jsx';

const Assets = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [assets, setAssets] = useState([]);
  const [id , setId] = useState(null);

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

  const getAssets = async () => {
      try {
          const response = await fetch(`http://localhost:4200/assets/get/${id}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
          });

          if (!response.ok) {
              throw new Error('Failed to fetch assets');
          }

          const jsonData = await response.json();
          console.log(jsonData.assets);
          setAssets(jsonData.assets);
      } catch (error) {
          console.error('Error:', error);
      }
  };

  useEffect(() => {
      if (token) {
          getAssets();
      }
  }, [token]);
  return (
    <div   className="assets dashboard">
      <div>
        <h4   className="mt-2">Assets</h4>
        <div   className="row">
          {assets.map((asset, index) => (
            <div   className="col-3 mb-3" key={index}>
              <a href="#" data-bs-toggle="modal" className='text-decoration-none' data-bs-target={`#staticBackdrop${index}`}>
                <AssetCard name={asset.name} type={asset.type} description={asset.description} url={asset.url} />
              </a>
              <AssetModal {...asset} modalId={`staticBackdrop${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Assets.propTypes = {
  assets: PropTypes.arrayOf(assetShape).isRequired,
};

export default Assets;

 