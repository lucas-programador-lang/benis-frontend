export default {

async fetch(request, env) {

if(request.method === "POST"){

const pedido = await request.json()

await env.DB.prepare(

"INSERT INTO pedidos (cliente, telefone, endereco, itens, total, status) VALUES (?,?,?,?,?,?)"

)

.bind(

pedido.cliente,

pedido.telefone,

pedido.endereco,

JSON.stringify(pedido.itens),

pedido.total,

"novo"

)

.run()

return new Response("Pedido recebido")

}

}

}
