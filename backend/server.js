const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/fetch-details', async (req, res) => {
  const { url } = req.query;

  try {
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url);
    console.log(`Response status: ${response.status}`);

    if (response.status !== 200) {
      throw new Error(`Failed to get URL, status code: ${response.status}`);
    }

    console.log('Fetched HTML content successfully.');

    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);

    let productData = {};

    
    const scriptTag = $('script[type="application/ld+json"]').html();
    if (scriptTag) {
      try {
        const ldJson = JSON.parse(scriptTag);
        if (ldJson['@type'] === 'Product') {
          productData.imageUrl = ldJson.image || '';
        }
      } catch (jsonError) {
        console.log('Error parsing JSON-LD data:', jsonError);
      }
    }

    
    productData.imageUrl = productData.imageUrl || $('link[rel="preload"][as="image"]').attr('href') || '';
    productData.name = $('h3.MuiTypography-root.MuiTypography-h3').first().text().trim();
    productData.brand = $('a[hreflang="uz"] .MuiTypography-root.MuiTypography-body1').text().replace('open_in_new', '').trim();
    
    const discountElement = $('.MuiStack-root.mui-riwxr7').text().trim();
    const originalPriceElement = $('p.MuiTypography-root.MuiTypography-body1.mui-11kctyc').first().text().trim();
    const discountedPriceElement = $('span.MuiTypography-root.MuiTypography-infoValue.mui-pumome').text().trim();

    
    if (discountElement) {
      productData.discountPercentage = discountElement;
      productData.originalPrice = originalPriceElement;
      productData.discountedPrice = discountedPriceElement;
    } else {
      productData.originalPrice = discountedPriceElement;
      productData.discountedPrice = discountedPriceElement;
    }

    console.log('Extracted product data:', productData);

    
    if (!productData.imageUrl || !productData.name || !productData.brand || !productData.originalPrice) {
      return res.status(404).json({ error: 'Incomplete product data', productData });
    }

    
    return res.json(productData);

  } catch (error) {
    console.error('Error fetching details:', error.message);
    res.status(500).json({ error: 'Failed to fetch details', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
