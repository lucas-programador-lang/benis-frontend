/**
 * BENIS BURGUER - Cloudflare Worker v4.1
 * Módulo: API Central de Pedidos & Banco de Dados D1
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Em produção, mude para seu domínio
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Responde ao Preflight do CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // --- ROTA: ATUALIZAR STATUS (POST /api/status) ---
      if (request.method === "POST" && url.pathname.endsWith("/status")) {
        const { id, status } = await request.json();
        
        await env.DB.prepare("UPDATE pedidos SET status = ? WHERE id = ?")
          .bind(status, id)
          .run();

        return new Response(JSON.stringify({ success: true, statusAtualizado: status }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // --- ROTA: CRIAR NOVO PEDIDO (POST /api) ---
      if (request.method === "POST") {
        const p = await request.json();

        // Inserção com tratamento para valores nulos
        await env.DB.prepare(
          "INSERT INTO pedidos (cliente, telefone, endereco, itens, total, status, data) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now', 'localtime'))"
        )
        .bind(
          p.cliente || "Cliente Balcão",
          p.telefone || "",
          p.endereco || "Porto Velho",
          p.itens || "[]",
          p.total || 0,
          "novo"
        )
        .run();

        return new Response(JSON.stringify({ ok: true, msg: "Pedido Gravado no D1!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // --- ROTA: LISTAR PEDIDOS (GET /api) ---
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM pedidos ORDER BY id DESC LIMIT 50"
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

    return new Response("Rota Inválida", { status: 404, headers: corsHeaders });
  }
}
