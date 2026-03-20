/**
 * MINDSET ELITE - Cloudflare Worker v4.0
 * Módulo: API Central de Pedidos & Status
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Em produção, você pode colocar seu domínio aqui
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Responde a requisições de pré-verificação (CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // --- ROTA: ATUALIZAR STATUS DO PEDIDO ---
      if (request.method === "POST" && url.pathname.includes("/status")) {
        const { id, status } = await request.json();
        
        await env.DB.prepare("UPDATE pedidos SET status = ? WHERE id = ?")
          .bind(status, id)
          .run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // --- ROTA: CRIAR NOVO PEDIDO ---
      if (request.method === "POST") {
        const pedido = await request.json();

        // Inserção profissional com Timestamp
        await env.DB.prepare(
          "INSERT INTO pedidos (cliente, telefone, endereco, itens, total, status) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(
          pedido.cliente,
          pedido.telefone,
          pedido.endereco || "Retirada",
          JSON.stringify(pedido.itens),
          pedido.total,
          "novo"
        )
        .run();

        return new Response(JSON.stringify({ ok: true, msg: "Pedido recebido!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // --- ROTA: LISTAR PEDIDOS (PARA O ADMIN) ---
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM pedidos ORDER BY id DESC LIMIT 100"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response("Rota não encontrada", { status: 404, headers: corsHeaders });
  }
}
