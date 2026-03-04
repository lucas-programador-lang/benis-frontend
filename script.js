const API_URL = "https://benis-backend.onrender.com"

const phone = "5569993668336"

const products = [
    {name:"Misto Quente",price:7},
    {name:"X-Bauru",price:8},
    {name:"X-Burger",price:13},
    {name:"X-Salada",price:14},
    {name:"X-Salada Especial",price:17},
    {name:"X-Calabresa",price:18},
    {name:"X-Bacon",price:19},
    {name:"X-Franbacon",price:20},
    {name:"X-Frango",price:18},
    {name:"X-Turbinado",price:20},
    {name:"X-Bagunça",price:20},
    {name:"X-Tudo",price:23},
    {name:"X-Havaiano",price:19},
    {name:"X-Benis",price:26},
    {name:"Batata Frita",price:15},
    {name:"Batata + Cheddar + Bacon",price:25},
    {name:"Coca Cola 2L",price:15},
    {name:"Coca Cola 1L",price:10},
    {name:"Tuchaua 2L",price:9},
    {name:"Dydyo 2L",price:9}
]

let cart = []

const container = document.getElementById("products")

products.forEach(product=>{
    container.innerHTML+=`
        <div class="card">
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.name}',${product.price})">Adicionar</button>
        </div>
    `
})

function addToCart(name,price){
    cart.push({name,price})
    updateCart()
}

function updateCart(){
    document.getElementById("cart-count").innerText = cart.length
    const cartDiv=document.getElementById("cart-items")
    cartDiv.innerHTML=""
    let total=0

    cart.forEach(item=>{
        total+=item.price
        cartDiv.innerHTML+=`<p>${item.name} - R$ ${item.price.toFixed(2)}</p>`
    })

    document.getElementById("total").innerText=total.toFixed(2)
}

function toggleCart(){
    const modal=document.getElementById("cart-modal")
    modal.classList.toggle("active")
}

function checkout(){
    if(cart.length===0){
        alert("Carrinho vazio")
        return
    }

    let message="🍔 Pedido Benis Burguer:%0A"
    let total=0

    cart.forEach(item=>{
        message+=`${item.name} - R$ ${item.price.toFixed(2)}%0A`
        total+=item.price
    })

    message+=`%0ATotal: R$ ${total.toFixed(2)}`

    window.open(`https://wa.me/${phone}?text=${message}`)
}
