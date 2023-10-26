window.onload = async function() {
    const productsGrid = document.querySelector(".products-grid");

    const response = await fetch("/php/fetch_products.php");
    
    if (!response || !response.ok) {
        return;
    }

    const data = await response.json();

    console.log(data);

    data.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = product.img_path;
        productImage.alt = product.title;

        const productInfo = document.createElement("div");

        const productName = document.createElement("h3");
        productName.textContent = product.title;

        const productPrice = document.createElement("span");
        productPrice.textContent = `R$ ${Number(product.price).toFixed(2)}`;

        const productButton = document.createElement("button");
        productButton.textContent = "Adicionar ao carrinho";

        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productCard.appendChild(productButton);

        productsGrid.appendChild(productCard);
    });
}
