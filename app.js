// 初始化摄像头功能
const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error('Error accessing camera: ', err);
  });

// 捕捉图像并使用Tesseract.js进行OCR识别
document.getElementById('capture-btn').addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL('image/png');
  recognizeText(imageData);
});

// 使用Tesseract.js进行OCR
function recognizeText(imageData) {
  Tesseract.recognize(
    imageData, 'eng',
    { logger: (m) => console.log(m) }
  ).then(({ data: { text } }) => {
    document.getElementById('result').innerText = `Recognized Text: ${text}`;
    // 在此处进一步处理识别的成分
  });
}

// 手动输入成分的分析
document.getElementById('manual-btn').addEventListener('click', () => {
  const ingredient = document.getElementById('manual-input').value;
  fetchIngredientData(ingredient);
});

// 从OpenFoodFacts获取成分信息
function fetchIngredientData(ingredient) {
  const apiUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${ingredient}&search_simple=1&json=1`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.count > 0) {
        const product = data.products[0];
        displayProductData(product);
      } else {
        document.getElementById('result').innerText = 'No ingredient data found!';
      }
    })
    .catch(error => {
      document.getElementById('result').innerText = 'Error fetching ingredient data.';
    });
}

function displayProductData(product) {
  const productInfo = `
    <h3>${product.product_name}</h3>
    <p><strong>Ingredients:</strong> ${product.ingredients_text || 'N/A'}</p>
    <p><strong>Nutritional Information:</strong> ${product.nutriments ? product.nutriments.sugars_100g : 'N/A'}g sugar/100g</p>
  `;
  document.getElementById('result').innerHTML = productInfo;
}
