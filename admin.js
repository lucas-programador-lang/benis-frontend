const API_URL = "https://benis-backend.onrender.com"

// Carregar pedidos do backend real
async function loadOrders(){
    try{
        const response = await fetch(`${API_URL}/orders`)
        const orders = await response.json()

        const container = document.getElementById("orders")
        container.innerHTML = ""

        if(orders.length === 0){
            container.innerHTML = "<p>Nenhum pedido ainda.</p>"
            return
        }

        orders.forEach((order,index)=>{
            container.innerHTML += `
                <div class="card">
                    <p><strong>Pedido #${index+1}</strong></p>
                    ${order.items.map(item=>`
                        <p>${item.name} - R$ ${Number(item.price).toFixed(2)}</p>
                    `).join("")}
                    <p><strong>Total:</strong> R$ ${Number(order.total).toFixed(2)}</p>
                    <p><small>${new Date(order.createdAt).toLocaleString()}</small></p>
                </div>
            `
        })

    }catch(error){
        console.error("Erro ao carregar pedidos:", error)
    }
}

// Atualiza automaticamente a cada 5 segundos
setInterval(loadOrders,5000)

// Carrega quando abrir a página
loadOrders()
