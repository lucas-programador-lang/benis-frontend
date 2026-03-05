let cart=[]
let total=0

function add(name,price){

cart.push({name,price})

total+=price

update()

}

function update(){

let items=document.getElementById("cart-items")

items.innerHTML=""

cart.forEach(i=>{

let li=document.createElement("li")

li.innerText=i.name+" R$"+i.price

items.appendChild(li)

})

document.getElementById("total").innerText=total

document.getElementById("cart-count").innerText=cart.length

}

function toggleCart(){

document.getElementById("cart").classList.toggle("open")

}

function pix(){

let txt="Pedido Benis Burguer%0A"

cart.forEach(i=>{

txt+=i.name+" R$"+i.price+"%0A"

})

txt+="Total:"+total

window.open("https://wa.me/556993668336?text="+txt)

}

function review(){

let name=document.getElementById("name").value
let msg=document.getElementById("msg").value

let div=document.createElement("div")

div.innerHTML="<b>"+name+"</b><p>"+msg+"</p>"

document.getElementById("reviews").appendChild(div)

}

function horario(){

let now=new Date()

let h=now.getHours()

let status=document.getElementById("status")

if(h>=19 && h<24){

status.innerText="🟢 Aberto"

}else{

status.innerText="🔴 Fechado"

}

}

horario()
