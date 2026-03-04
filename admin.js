const API_URL="https://benis-backend.onrender.com"
let lastCount=0

async function loadOrders(){
const container=document.getElementById("orders")
const response=await fetch(`${API_URL}/orders`)
const orders=await response.json()

if(orders.length>lastCount){
document.getElementById("notification-sound").play()
}

lastCount=orders.length
container.innerHTML=""

orders.forEach(order=>{
container.innerHTML+=`
<div class="admin-card">
<h3>Status: ${order.status}</h3>
<p>Total: R$ ${order.total.toFixed(2)}</p>
<p>${new Date(order.createdAt).toLocaleString()}</p>

<div>
<button onclick="updateStatus('${order._id}','Em preparo')">Em preparo</button>
<button onclick="updateStatus('${order._id}','Saiu para entrega')">Saiu</button>
<button onclick="updateStatus('${order._id}','Finalizado')">Finalizado</button>
<button onclick="printOrder()">🖨 Imprimir</button>
</div>

<hr>
${order.items.map(i=>`
<p>${i.name} x${i.quantity}</p>
<p>${i.extras.map(e=>e.name).join(", ")}</p>
`).join("")}

</div>
`
})
}

async function updateStatus(id,status){
await fetch(`${API_URL}/orders/${id}/status`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({status})
})
loadOrders()
}

function printOrder(){
window.print()
}

setInterval(loadOrders,5000)
loadOrders()
