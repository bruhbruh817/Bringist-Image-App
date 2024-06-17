import React from 'react';
import './Template1.css';
import bringistLogo from './bringist.png';
import templateLogo from './logo_checkered.png';
import bringistCircleLogo from './bringist.jpg';

const Template1 = ({
  imageUrl,
  originalPrice,
  discountedPrice,
  name,
  brand,
  discountPercentage,
  gradient,
}) => {
  return (
    <div className="template1">
      <div id="image-with-price" className="image-wrapper" style={{ backgroundImage: `${gradient}` }}>
        <img src={templateLogo} alt="Template Logo" className="template-logo" />
        <div className="header">
          <img src={bringistLogo} alt="Bringist Logo" className="bringist-logo" />
        </div>
        <div className="content">
          <div className="image-padding">
            <img src={imageUrl} alt="Product" className="product-image" />
          </div>
          <div className="logo-circle">
            <img src={bringistCircleLogo} alt="Logo" />
          </div>
        </div>
        <div className="brand-container">
          <span className="brand-name">{brand}</span>
          <span className="product-name">{name}</span>
        </div>
        <div className="price-container">
          <div className="price-details">
            {discountPercentage ? (
              <>
                <span className="original-price">{originalPrice}</span>
                <span className="discounted-price">{discountedPrice}</span>
              </>
            ) : (
              <span className="discounted-price">{originalPrice}</span>
            )}
          </div>
          {discountPercentage && (
            <div className="discount-badge">{discountPercentage}</div>
          )}
        </div>
        <div className="bringist-text">bringist.uzbekistan</div>
        <div className="three-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Template1;
