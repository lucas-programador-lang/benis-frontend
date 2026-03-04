const API_URL = "https://benis-backend.onrender.com"

const products = [
    {name:"X-Burger",price:13},
    {name:"X-Bacon",price:19},
    {name:"X-Salada Especial",price:17},
    {name:"X-Tudo",price:23},
    {name:"Batata Frita",price:15},
    {name:"X-Frango",price:20}
]

let cart = []

const container = document.getElementById("products")

products.forEach(product=>{
    container.innerHTML+=`
        <div class="card">
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.name}',${product.price})">
                Adicionar
            </button>
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
    modal.style.display = modal.style.display==="flex" ? "none" : "flex"
}

async function checkout(){
    if(cart.length===0){
        alert("Carrinho vazio")
        return
    }

    let total = 0
    cart.forEach(item=> total += item.price)

    const newOrder = {
        items: cart,
        total: total
    }

    try{
        const response = await fetch(`${API_URL}/orders`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newOrder)
        })

        if(!response.ok){
            throw new Error("Erro ao enviar pedido")
        }

        alert("Pedido enviado com sucesso!")

        cart = []
        updateCart()
        toggleCart()

    }catch(error){
        console.error(error)
        alert("Erro ao enviar pedido")
    }
}
