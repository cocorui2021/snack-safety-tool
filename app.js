// 选择元素
const scanBtn = document.getElementById('scan-btn');
const resultDiv = document.getElementById('result');

// 示例条形码
const barcode = '737628064502';  // 你可以动态生成条码

// 调用 OpenFoodFacts API
async function fetchProductData(barcode) {
  const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 1) {
      displayProductData(data.product);
    } else {
      resultDiv.innerText = 'Product not found!';
    }
  } catch (error) {
    resultDiv.innerText = 'Error fetching product data.';
  }
}

// 显示产品信息
function displayProductData(product) {
  const productInfo = `
    <h3>${product.product_name}</h3>
    <p><strong>Ingredients:</strong> ${product.ingredients_text}</p>
    <p><strong>Sugar:</strong> ${product.nutriments.sugars_100g}g/100g</p>
    <p><strong>Fat:</strong> ${product.nutriments.fat_100g}g/100g</p>
    <p><strong>Source:</strong> OpenFoodFacts</p>
  `;
  resultDiv.innerHTML = productInfo;
}

// 当点击扫描按钮时调用API
scanBtn.addEventListener('click', () => {
  fetchProductData(barcode);
});
