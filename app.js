console.log("app.js running...");

const products = [];
const totalCart = $('#in-cart');

$(document).ready(() => {

    $('.cart-dropdown').hide();
    $('.drop-cart-clear').click(() => {
        localStorage.clear()
        totalCart.html('0')
        $('#drop-cart-total-price').html('0')
        $('.cart-dropdown').hide()
        renderDropCartItem()
    })

    $.getJSON('https://webacademy.se/fakestore/', (data) =>
    $.each(data, (index, e) => 
    {
        let productName = e.title;
        productName = productName.substring(0,productName.indexOf(' '));
        const product = {
            id: e.id,
            title: e.title,
            price: parseInt(e.price),
            category: e.category,
            description: e.description,
            image: e.image,
            inCart: 0,
            productName: productName 
            };
            products.push(product);

            $(".product-container").append(
                `
                <div class="product-div">
                    <h1 class="product-title">${e.title}</h1>
                    <img class="product-img"src="${e.image}" alt="product image">
                    <p class="product-text" >${e.description}</p>
                    <h2 class="product-price">${parseInt(e.price)}</h2>
                    <button class="add-to-cart-btn" id="${e.id}">Add to cart</button>
                </div>
                `
            )
            $("#" + e.id +"").click(function() {
                addFuctionToAllProductCardButtons(this)
            })  
    }))

    function addFuctionToAllProductCardButtons(e) {
       cartNumbers("add");
       totalSumOfCart(products[e.id -1]);
       addProductToCart(products[e.id -1]);
    }

    function cartNumbers(subtractAdd){
        let productNumbers = parseInt(localStorage.getItem('cartNumbers'));
        if (productNumbers) {
            if(subtractAdd === "add"){
                localStorage.setItem('cartNumbers', productNumbers + 1);
            }else if (subtractAdd === "subtract"){
                localStorage.setItem('cartNumbers', productNumbers - 1);
            }
        }else {
        localStorage.setItem('cartNumbers', 1);
        }
        updateCartUI();
    }

    function totalSumOfCart(product){
        let price = localStorage.getItem('totalPriceOfCart');
        price != null ? localStorage.setItem('totalPriceOfCart', parseInt(price) + product.price) : localStorage.setItem('totalPriceOfCart', product.price);
    } 

    function addProductToCart(product){
        let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
        if(cartItems != null){
            if(cartItems[product.id] == undefined){
                product.inCart = 1
                cartItems = {
                    ...cartItems, 
                    [product.id]: product
                }
            }else{
                cartItems[product.id].inCart += 1;
            }
        } else {
            product.inCart = 1
            cartItems = {
                [product.id]: product
            }
        }
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));
        renderDropCartItem();
        updateCartUI();
    } 

    function renderDropCartItem() {
        let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
        let dropCart = $('.line-item-container');
        if(cartItems && dropCart){
            dropCart.html("");
        $.each(cartItems, (index, e) => {
            dropCart.append(` 
            <div class="line-item">
                      <p class="cart-1 drop-product">${e.productName}</p>
                      <p class="cart-2 drop-quantity">${e.inCart}</p>
                      <p class="cart-3 drop-a-price">${e.price}</p>
                      <p class="cart-4 drop-total-price-">${e.price * e.inCart}</p>
            </div>
            `)
        })
        $('#drop-cart-total-price').html(JSON.parse(localStorage.getItem('totalPriceOfCart')))
        }else{
            dropCart.html("");
        }
    }
 
    $('.cart').click(() => $('.cart-dropdown').slideToggle(300)) 

    $('.go-to-cart').click(() => window.location.href = "./cart/") 
})

function updateCartUI(){
    let productNumbers = parseInt(localStorage.getItem('cartNumbers'));
    productNumbers ? totalCart.html(productNumbers):totalCart.html(0);
} 

window.onload = () => { 
    updateCartUI();
}
