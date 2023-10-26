window.onload = create_product_cards();

async function create_product_cards() {
    const response = await fetch("/php/fetch_products.php");
    if (!response || !response.ok)
        return;

    const data = await response.json();
    console.log(data);

    const productsGrid = document.querySelector(".products-grid");
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
        productButton.id = `product-${product.product_id}`;
        productButton.textContent = "Adicionar ao carrinho";
        productButton.onclick = async () => {
            const id = productButton.id.split("-")[1];
            await fetch("/php/add_product_to_cart.php", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    // FIXME: get user id from session cookie
                    product_id: id,
                }),
            });
        };

        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productCard.appendChild(productButton);

        productsGrid.appendChild(productCard);
    });
}
