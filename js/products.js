window.onload = () => {
    const productsGrid = document.querySelector(".products-grid");

    const data = [
        {
            name: "Product 1",
            price: 10.99,
            image: "product1.jpg",
        },
        {
            name: "Product 2",
            price: 19.99,
            image: "product2.jpg",
        },
        {
            name: "Product 3",
            price: 7.99,
            image: "product3.jpg",
        },
        {
            name: "Product 4",
            price: 14.99,
            image: "product4.jpg",
        },
    ];

    data.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;

        const productInfo = document.createElement("div");

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productPrice = document.createElement("span");
        productPrice.textContent = `R$ ${product.price.toFixed(2)}`;

        const productButton = document.createElement("button");
        productButton.textContent = "Adicionar ao carrinho";

        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productCard.appendChild(productButton);

        productsGrid.appendChild(productCard);
    });
};
