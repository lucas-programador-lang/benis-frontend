const API_URL = "https://benis-backend.onrender.com"

let lastCount = 0
let chartInstance = null

/* ================= CARREGAR PEDIDOS ================= */

async function loadOrders(){

const container = document.getElementById("orders")
const response = await fetch(`${API_URL}/orders`)
const orders = await response.json()

/* ===== NOTIFICAÇÃO ===== */

if(orders.length > lastCount){
document.getElementById("notification-sound").play()
}
lastCount = orders.length

container.innerHTML = ""

/* ===== MÉTRICAS ===== */

let totalSales = 0
orders.forEach(o => totalSales += o.total)

document.getElementById("totalSales").innerText = "R$ " + totalSales.toFixed(2)
document.getElementById("totalOrders").innerText = orders.length

renderChart(orders)

/* ===== LISTAR PEDIDOS ===== */

orders.forEach(order => {

container.innerHTML += `
<div class="admin-card">

<h3>Status:
<span class="status status-${order.status}">
${order.status}
</span>
</h3>

<p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
<p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

<div style="margin:10px 0;">
<button onclick="updateStatus('${order._id}','Em preparo')">Em preparo</button>

<button onclick="sendToRider('${order._id}',${order.total})">
Enviar para Entregador
</button>

<button onclick="updateStatus('${order._id}','Finalizado')">
Finalizado
</button>

<button onclick="printOrder(this)">🖨 Imprimir</button>
</div>

<hr>

${order.items.map(i=>`
<div>
<p><strong>${i.name}</strong></p>
<p>Qtd: ${i.quantity || 1}</p>
<p>${i.extras ? i.extras.map(e=>e.name).join(", ") : ""}</p>
</div>
`).join("")}

${order.rider ? `<p><strong>Entregador:</strong> ${order.rider}</p>` : ""}
${order.commission ? `<p><strong>Comissão:</strong> R$ ${order.commission.toFixed(2)}</p>` : ""}

</div>
`
})
}

/* ================= GRÁFICO ================= */

function renderChart(orders){

let salesByDay = {}

orders.forEach(o=>{
let date = new Date(o.createdAt).toLocaleDateString()
salesByDay[date] = (salesByDay[date] || 0) + o.total
})

const labels = Object.keys(salesByDay)
const values = Object.values(salesByDay)

if(chartInstance){
chartInstance.destroy()
}

chartInstance = new Chart(document.getElementById("salesChart"),{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Vendas por Dia (R$)",
data:values,
backgroundColor:"#ff4d00"
}]
}
})
}

/* ================= STATUS ================= */

async function updateStatus(id,status){

await fetch(`${API_URL}/orders/${id}/status`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({status})
})

loadOrders()
}

/* ================= ENTREGADOR ================= */

async function sendToRider(id,total){

let rider = prompt("Nome do entregador:")
if(!rider) return

let commission = total * 0.20

await fetch(`${API_URL}/orders/${id}/status`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
status:"Saiu para entrega",
rider:rider,
commission:commission
})
})

loadOrders()
}

/* ================= IMPRESSÃO ================= */

function printOrder(button){

const card = button.closest(".admin-card")
const printWindow = window.open("", "", "width=600,height=600")
printWindow.document.write("<html><body>")
printWindow.document.write(card.innerHTML)
printWindow.document.write("</body></html>")
printWindow.document.close()
printWindow.print()
}

/* ================= AUTO UPDATE ================= */

setInterval(loadOrders,5000)
loadOrders()
