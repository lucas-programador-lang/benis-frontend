/**
 * MINDSET ELITE - Backend API v4.0
 * Plataforma: Cloudflare Workers + D1 Database
 */

export default {
  async fetch(request, env) {
    // 1. Configuração de CORS (Essencial para Produção)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Em produção, mude para seu domínio real
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Responde a requisições de "pre-flight" do navegador
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // --- ROTA DE CRIAÇÃO DE PEDIDO (POST) ---
      if (request.method === "POST") {
        const pedido = await request.json();

        // Validação básica de segurança
        if (!pedido.cliente || !pedido.telefone || !pedido.itens) {
          return new Response(JSON.stringify({ error: "Dados incompletos" }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const info = await env.DB.prepare(
          "INSERT INTO pedidos (cliente, telefone, endereco, itens, total, status, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          pedido.cliente,
          pedido.telefone,
          pedido.endereco || "Retirada",
          JSON.stringify(pedido.itens),
          pedido.total,
          "novo",
          new Date().toISOString() // Data de criação automática
        )
        .run();

        return new Response(JSON.stringify({ ok: true, id: info.meta.last_row_id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // --- ROTA DE LISTAGEM DE PEDIDOS (GET) ---
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM pedidos ORDER BY criado_em DESC LIMIT 50"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Rota não encontrada
      return new Response("Não encontrado", { status: 404, headers: corsHeaders });

    } catch (error) {
      // Log de erro para debug no painel da Cloudflare
      console.error(`Erro no Worker: ${error.message}`);
      
      return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
}
