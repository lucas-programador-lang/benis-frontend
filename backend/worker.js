/**
 * MINDSET ELITE - Backend API v4.1 (Premium Edition)
 * Plataforma: Cloudflare Workers + D1 Database
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. Configuração de CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Em produção, restrinja para o domínio do seu frontend
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    };

    // Resposta para OPTIONS (Pre-flight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      /**
       * --- ROTA: CRIAR PEDIDO (POST /pedidos) ---
       */
      if (request.method === "POST" && url.pathname === "/pedidos") {
        const pedido = await request.json();

        // Validação de Campos Obrigatórios
        const camposObrigatorios = ["cliente", "telefone", "itens", "total"];
        for (const campo of camposObrigatorios) {
          if (!pedido[campo]) {
            return new Response(
              JSON.stringify({ error: `O campo ${campo} é obrigatório.` }), 
              { status: 400, headers: corsHeaders }
            );
          }
        }

        // Inserção no Banco D1
        const info = await env.DB.prepare(
          `INSERT INTO pedidos (
            cliente, 
            telefone, 
            endereco, 
            itens, 
            total, 
            status, 
            criado_em
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          pedido.cliente,
          pedido.telefone,
          pedido.endereco || "Retirada no Local",
          typeof pedido.itens === 'string' ? pedido.itens : JSON.stringify(pedido.itens),
          pedido.total,
          "novo",
          new Date().toISOString()
        )
        .run();

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Pedido registrado com sucesso!",
            id: info.meta.last_row_id 
          }), 
          { status: 201, headers: corsHeaders }
        );
      }

      /**
       * --- ROTA: LISTAR PEDIDOS (GET /pedidos) ---
       * Ideal para o seu Dashboard Admin
       */
      if (request.method === "GET" && url.pathname === "/pedidos") {
        // Busca os últimos 50 pedidos
        const { results } = await env.DB.prepare(
          "SELECT * FROM pedidos ORDER BY criado_em DESC LIMIT 50"
        ).all();

        // Faz o parse dos itens (que estão como string no SQLite) de volta para objeto
        const pedidosFormatados = results.map(p => ({
          ...p,
          itens: typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens
        }));

        return new Response(
          JSON.stringify(pedidosFormatados), 
          { status: 200, headers: corsHeaders }
        );
      }

      /**
       * --- ROTA: ATUALIZAR STATUS (POST /atualizar-status) ---
       */
      if (request.method === "POST" && url.pathname === "/atualizar-status") {
        const { id, status } = await request.json();
        
        await env.DB.prepare("UPDATE pedidos SET status = ? WHERE id = ?")
          .bind(status, id)
          .run();

        return new Response(
          JSON.stringify({ success: true, message: "Status atualizado!" }), 
          { status: 200, headers: corsHeaders }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({ error: "Endpoint não encontrado" }), 
        { status: 404, headers: corsHeaders }
      );

    } catch (error) {
      console.error(`[MINDSET ELITE ERROR]: ${error.stack}`);
      
      return new Response(
        JSON.stringify({ 
          error: "Erro interno no servidor", 
          details: error.message 
        }), 
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
