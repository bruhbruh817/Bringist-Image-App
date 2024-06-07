import React, { useState } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import './App.css';
import bringistLogo from './bringist.png';
import templateLogo from './logo_checkered.png';
import adidasLogo from './adidas.png';
import nikeLogo from './nike.png';
import pumaLogo from './puma.png';

function App() {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [gradient, setGradient] = useState('linear-gradient(102.11deg, rgba(102, 54, 179, 0.8) 2.24%, rgba(161, 112, 223, 0.8) 50.27%, rgba(212, 165, 245, 0.8) 98.95%)');
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await axios.get(`http://localhost:5000/fetch-details?url=${encodedUrl}`);
      const { imageUrl, originalPrice, discountedPrice, name, brand, discountPercentage } = response.data;

      setImageUrl(imageUrl);
      setOriginalPrice(originalPrice);
      setDiscountedPrice(discountedPrice);
      setName(name);
      setBrand(brand);
      setDiscountPercentage(discountPercentage);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert('Error fetching the page. Please try again.');
    }
    setLoading(false);
  };

  const handleDownload = () => {
    toPng(document.getElementById('image-with-price'))
      .then((dataUrl) => {
        download(dataUrl, 'image.png');
      })
      .catch((error) => {
        console.error('something went wrong!', error);
      });
  };

  const handleGradientChange = (event) => {
    setGradient(event.target.value);
  };

  const handleLogoChange = (event) => {
    const selectedLogo = event.target.value;
    if (selectedLogo === 'none') setLogo('');
    if (selectedLogo === 'adidas') setLogo(adidasLogo);
    if (selectedLogo === 'nike') setLogo(nikeLogo);
    if (selectedLogo === 'puma') setLogo(pumaLogo);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bringist Image Builder</h1>
        <input
          type="text"
          placeholder="Enter product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field"
        />
        <button onClick={fetchDetails} className="fetch-button">Load Image</button>
        <div className="select-container">
          <select onChange={handleGradientChange} className="select-gradient">
            <option value="linear-gradient(102.11deg, rgba(102, 54, 179, 0.8) 2.24%, rgba(161, 112, 223, 0.8) 50.27%, rgba(212, 165, 245, 0.8) 98.95%)">Purple</option>
            <option value="linear-gradient(102.11deg, rgba(112, 69, 175, 0.8) 2.24%, rgba(138, 99, 210, 0.8) 50.27%, rgba(180, 134, 243, 0.8) 98.95%)">Lavender</option>
            <option value="linear-gradient(102.11deg, rgba(52, 0, 134, 0.8) 2.24%, rgba(102, 54, 179, 0.8) 50.27%, rgba(161, 112, 223, 0.8) 98.95%)">Violet</option>
            <option value="linear-gradient(102.11deg, rgba(40, 0, 104, 0.9) 2.24%, rgba(82, 43, 143, 0.9) 50.27%, rgba(129, 90, 179, 0.9) 98.95%)">Deep Purple</option>
          </select>
          <select onChange={handleLogoChange} className="select-logo">
            <option value="none">None</option>
            <option value="adidas">Adidas</option>
            <option value="nike">Nike</option>
            <option value="puma">Puma</option>
          </select>
        </div>
        {loading ? (
          <div className="loader"></div>
        ) : (
          imageUrl && (
            <div className="image-container">
              <div id="image-with-price" className="image-wrapper" style={{ backgroundImage: `${gradient}` }}>
                <img src={templateLogo} alt="Template Logo" className="template-logo" />
                <div className="header">
                  <img src={bringistLogo} alt="Bringist Logo" className="bringist-logo" />
                  {logo && <img src={logo} alt="Logo" className="top-right-logo" />}
                </div>
                <div className="content">
                  <img src={imageUrl} alt="Product" className="product-image" />
                </div>
                <div className="brand-and-name">
                  <span className="brand-name">{brand}</span>
                  <span className="product-name">{name}</span>
                </div>
                <div className="price-container">
                  <div className="price-details">
                    {originalPrice && (
                      <span className="original-price">{originalPrice}</span>
                    )}
                    {discountedPrice && (
                      <span className="discounted-price">{discountedPrice}</span>
                    )}
                  </div>
                  {discountPercentage && (
                    <div className="discount-badge">{discountPercentage}</div>
                  )}
                </div>
              </div>
              <button onClick={handleDownload} className="download-button">Download Image</button>
            </div>
          )
        )}
      </header>
    </div>
  );
}

export default App;
