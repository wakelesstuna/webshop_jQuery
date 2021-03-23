console.log("app.js running...");

const products = [];
const $totalCart = $('#in-cart');

$(document).ready(() => {

    $('.cart-dropdown').hide();
    $('.drop-cart-clear').click(() => {
        localStorage.clear()
        $totalCart.html('0')
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
        // detta är för att vi ska hämta rätt element i arrayen med produkter
        // därför tar vi knapp id -1 
       cartNumbers("add");
       // lägg till productens värde i totalsumman
       totalSumOfCart(products[e.id -1]);
       // spara proucter till kundvagnen
       addProductToCart(products[e.id -1]);
       
    }

    // to save products in cart to local strage
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
        let dropCart = document.querySelector('.line-item-container');
        if(cartItems && dropCart){
            dropCart.innerHTML = '';
        // här sätter vi id på cart-product till den aktuellt 
        // productens id så vi har tillgång till den senare
        Object.values(cartItems).map(e => {
            dropCart.innerHTML +=` 
            <div class="line-item">
                      <p class="cart-1 drop-product">${e.productName}</p>
                      <p class="cart-2 drop-quantity">${e.inCart}</p>
                      <p class="cart-3 drop-a-price">${e.price}</p>
                      <p class="cart-4 drop-total-price-">${e.price * e.inCart}</p>
            </div>
            `
        });
        $('#drop-cart-total-price').html(JSON.parse(localStorage.getItem('totalPriceOfCart')))
        }else{
            dropCart.innerHTML = '';
        }
        
    }

    function cartNumbers(subtractAdd){
        // vi får en sträng från local storage för att kunna lägga till en 
        // vara behöver vi parsa den till int
        let $productNumbers = parseInt(localStorage.getItem('cartNumbers'));
        // kollar om de finns något i cart om de finns lägger vi till 1 till värdet, annars lägger vi in 1
        if ($productNumbers) {
            if(subtractAdd === "add"){
                localStorage.setItem('cartNumbers', $productNumbers + 1);
                $totalCart.val($productNumbers + 1);
            }else if (subtractAdd === "subtract"){
                localStorage.setItem('cartNumbers', $productNumbers - 1);
                $totalCart.val($productNumbers - 1);
            }
        }else {
        localStorage.setItem('cartNumbers', 1);
        $totalCart.val(0);
        //document.querySelector('.cart span').textContent = 0;
        }
    }

    // to save totalprice of cart to local storage
    function totalSumOfCart(product){
        let price = localStorage.getItem('totalPriceOfCart');
        price != null ? localStorage.setItem('totalPriceOfCart', parseInt(price) + product.price) : localStorage.setItem('totalPriceOfCart', product.price);
    } 
    
    $('.cart').click(() => $('.cart-dropdown').slideToggle(300)) 

    $('.go-to-cart').click(() => window.location.href = "./cart/")

    renderDropCartItem();
    
})

// to update cart UI when page loads
function updateCartUI(){
    let productNumbers = parseInt(localStorage.getItem('cartNumbers'));
    //productNumbers ? document.querySelector('.cart span').textContent = productNumbers : document.querySelector('.cart span').textContent = 0;
    productNumbers ? $totalCart.html(productNumbers):$totalCart.html(0);
} 


// add function to all product cards buttons
//localStorage.setItem('productList', JSON.stringify(products));
window.onload = () => { 
    updateCartUI();
}
