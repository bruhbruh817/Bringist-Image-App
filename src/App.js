import React, { useState } from 'react';
import axios from 'axios';
import { toPng } from 'dom-to-image';
import download from 'downloadjs';
import Template1 from './Template1';
import './App.css';

function App() {
  const [inputs, setInputs] = useState([{ url: '' }]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradient, setGradient] = useState('linear-gradient(102.11deg, rgba(102, 54, 179, 0.8) 2.24%, rgba(161, 112, 223, 0.8) 50.27%, rgba(212, 165, 245, 0.8) 98.95%)');

  const fetchDetails = async (index) => {
    setLoading(true);
    try {
      const encodedUrl = encodeURIComponent(inputs[index].url);
      const response = await axios.get(`http://localhost:5000/fetch-details?url=${encodedUrl}`);
      const { imageUrl, originalPrice, discountedPrice, name, brand, discountPercentage } = response.data;

      const newDesign = {
        imageUrl,
        originalPrice,
        discountedPrice,
        name,
        brand,
        discountPercentage,
        gradient,
        logo: 'bringist.jpg',
        template: 'template1',
      };

      const updatedDesigns = [...designs];
      updatedDesigns[index] = newDesign;
      setDesigns(updatedDesigns);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert('Error fetching the page. Please try again.');
    }
    setLoading(false);
  };

  const handleDownload = (index) => {
    const element = document.getElementById(`design-${index}`);
    const button = element.querySelector('.download-button');
    const scale = 4;

    if (button) {
      button.style.display = 'none';
    }

    const clonedElement = element.cloneNode(true);
    clonedElement.style.transform = `scale(${scale})`;
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.width = `${element.offsetWidth * scale}px`;
    clonedElement.style.height = `${element.offsetHeight * scale}px`;

    document.body.appendChild(clonedElement);

    const images = Array.from(clonedElement.querySelectorAll('img'));
    const loadImage = (img) => new Promise((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = resolve;
      }
    });

    Promise.all(images.map(loadImage)).then(() => {
      toPng(clonedElement)
        .then((dataUrl) => {
          download(dataUrl, `image-${index + 1}.png`);
          document.body.removeChild(clonedElement);
          if (button) {
            button.style.display = 'block';
          }
        })
        .catch((error) => {
          console.error('Something went wrong!', error);
          document.body.removeChild(clonedElement);
          if (button) {
            button.style.display = 'block';
          }
        });
    });
  };

  const handleDownloadAll = () => {
    designs.forEach((_, index) => handleDownload(index));
  };

  const addInput = () => {
    setInputs([...inputs, { url: '' }]);
  };

  const removeInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
    setDesigns(designs.filter((_, i) => i !== index));
  };

  const updateInput = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index].url = value;
    setInputs(newInputs);
  };

  const renderTemplate = (design, index) => {
    return (
      <div id={`design-${index}`} key={index}>
        <Template1
          imageUrl={design.imageUrl}
          originalPrice={design.originalPrice}
          discountedPrice={design.discountedPrice}
          name={design.name}
          brand={design.brand}
          discountPercentage={design.discountPercentage}
          gradient={design.gradient}
          logo={design.logo}
        />
        <button onClick={() => handleDownload(index)} className="download-button">Download</button>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bringist Image Builder</h1>
        {inputs.map((input, index) => (
          <div key={index} className="design-inputs">
            <input
              type="text"
              placeholder="Enter product URL"
              value={input.url}
              onChange={(e) => updateInput(index, e.target.value)}
              className="input-field"
            />
            <button onClick={() => fetchDetails(index)} className="fetch-button">Load Image</button>
            <button onClick={() => removeInput(index)} className="add-remove-button">×</button>
          </div>
        ))}
        <button onClick={addInput} className="add-remove-button">+</button>
        <div className="select-container">
          <select onChange={(e) => setGradient(e.target.value)} className="select-gradient">
            <option value="linear-gradient(102.11deg, rgba(102, 54, 179, 0.8) 2.24%, rgba(161, 112, 223, 0.8) 50.27%, rgba(212, 165, 245, 0.8) 98.95%)">Purple</option>
            <option value="linear-gradient(102.11deg, rgba(112, 69, 175, 0.8) 2.24%, rgba(138, 99, 210, 0.8) 50.27%, rgba(180, 134, 243, 0.8) 98.95%)">Lavender</option>
            <option value="linear-gradient(102.11deg, rgba(52, 0, 134, 0.8) 2.24%, rgba(102, 54, 179, 0.8) 50.27%, rgba(161, 112, 223, 0.8) 98.95%)">Violet</option>
            <option value="linear-gradient(102.11deg, rgba(40, 0, 104, 0.9) 2.24%, rgba(82, 43, 143, 0.9) 50.27%, rgba(129, 90, 179, 0.9) 98.95%)">Deep Purple</option>
          </select>
        </div>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="design-container">
            {designs.map((design, index) => renderTemplate(design, index))}
          </div>
        )}
        {designs.length > 0 && (
          <div className="button-container">
            <button onClick={handleDownloadAll} className="download-all-button">Download All</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
