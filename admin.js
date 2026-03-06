let vendas=JSON.parse(localStorage.getItem("vendas")||"[]")

let total=0

vendas.forEach(v=>{

total+=v

})

document.getElementById("vendas").innerText=

"Total vendido: R$ "+total
