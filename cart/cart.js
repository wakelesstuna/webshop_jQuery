console.log("cart.js running...");

function renderCart(){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let cartProducts = $('.cart-products');
    
    if(cartItems === null){
        $('#total-price').val("0");
    }
    if(cartItems && cartProducts){
         cartProducts.html("");
        $.each(cartItems, (index, e) => {
            cartProducts.append(` 
            <div class="cart-product" id="${e.id}">
                <img src="${e.image}" class="cart-img">
                <span class="cart-product-name cart-font-size">${e.productName}</span>
                <div class="cart-price cart-font-size">${e.price}</div>
                <div class="cart-quantity">
                    <ion-icon name="add-circle-outline" class="add-product-to-cart"></ion-icon>
                    <span class="cart-font-size" class="quantity">${e.inCart}</span>
                    <ion-icon name="remove-circle-outline" class="remove-product-to-cart"></ion-icon>
                </div>
                <div class="cart-total cart-font-size">${e.price * e.inCart}</div>
            </div>
            `)
        })

        $.each($('.add-product-to-cart'),function( index, value ) {
            value.addEventListener('click',(e) => {
            addProductToCart(cartItems[e.target.parentElement.parentElement.id]);
            totalSumOfCart(cartItems[e.target.parentElement.parentElement.id], "add");
            cartNumbers(cartItems[e.target.parentElement.parentElement.id],"add");
            updateTotalPriceUI();
            renderCart();
            })
          })

          $.each($('.remove-product-to-cart'),function( index, value ) {
            value.addEventListener('click',(e) => {
                if(cartItems[e.target.parentElement.parentElement.id].inCart !== 0){
                    removeProductFromCart(cartItems[e.target.parentElement.parentElement.id]);
                    totalSumOfCart(cartItems[e.target.parentElement.parentElement.id], "subtract");
                    cartNumbers(cartItems[e.target.parentElement.parentElement.id],"subtract");
                    updateTotalPriceUI();
                    renderCart();
            }
          })
        })
    }
} 

function addProductToCart(product){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    if(cartItems != null){
            cartItems[product.id].inCart += 1;
            cartNumbers("add");
    } 
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
  }

function removeProductFromCart(product){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));   
    if(cartItems != 0){
            cartItems[product.id].inCart -= 1;
            cartNumbers("subtract");
    } 
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
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
        if(subtractAdd === "add"){
            localStorage.setItem('cartNumbers', productNumbers + 1);
        }
    }
    updateCartUI();
};

function totalSumOfCart(product, subtractAdd){
    let price = localStorage.getItem('totalPriceOfCart');
    if(price != null){
        if(subtractAdd === "add"){
            price = parseFloat(price);
            localStorage.setItem('totalPriceOfCart', price + product.price);
        }else if (subtractAdd === "subtract"){
            price = parseFloat(price);
            localStorage.setItem('totalPriceOfCart', price - product.price);
        }else{
            
        }
    }else{
        localStorage.setItem('totalPriceOfCart', product.price);
    }    
}

function updateCartUI(){
  let productNumbers = parseInt(localStorage.getItem('cartNumbers'));
  let cartSpan = $('.cart span');
  productNumbers ? cartSpan.text(productNumbers) : cartSpan.text(0);
}

function updateTotalPriceUI(){
    let price = parseFloat(localStorage.getItem('totalPriceOfCart'));
    let totalPrice = $('#total-price');
    
    if(!price){
       totalPrice.text("0");
    }else {
        totalPrice.text(price)
    }
} 

$("#clear-cart-btn").click(() => {
    localStorage.clear();
    location.reload();
})

window.onload = () => {
  renderCart();
  updateCartUI();
  updateTotalPriceUI();
};