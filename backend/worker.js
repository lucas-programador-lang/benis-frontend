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

return new Response(JSON.stringify({ok:true}))

}

if(request.method === "GET"){

const pedidos = await env.DB.prepare(

"SELECT * FROM pedidos ORDER BY id DESC"

).all()

return new Response(JSON.stringify(pedidos))

}

}

}
