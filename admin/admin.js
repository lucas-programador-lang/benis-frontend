/**
 * MINDSET ELITE - Admin Engine v4.1.1
 * Módulo: Gestão de Pedidos & BI (Otimizado para D1)
 */

const API_URL = "/pedidos"; // Ajustado para o endpoint do seu Cloudflare Worker

async function carregar() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Falha na conexão com a API");

        const data = await res.json();
        
        // Suporte ao formato de retorno do D1 (.results) ou array direto
        const pedidos = data.results || data;
        const tabela = document.getElementById("pedidosLista");
        
        if (!tabela) return;
        tabela.innerHTML = "";

        let totalPedidosHoje = 0;
        let faturamentoAcumulado = 0;
        let totalClientesUnicos = new Set(); 

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            
            // Lógica de Badges baseada no seu CSS anterior
            let statusStyle = "badge-novo";
            if (p.status === 'entregue') statusStyle = "badge-entregue";
            // Mantém laranja para 'preparando' ou 'saiu' conforme sua lógica de atenção
            if (p.status === 'preparando' || p.status === 'saiu') statusStyle = "badge-novo"; 

            // Tratamento de Itens (converte string JSON do banco para texto legível)
            let resumoItens = "Itens não especificados";
            try {
                const itensParse = typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens;
                resumoItens = Array.isArray(itensParse) ? itensParse.map(i => i.name).join(", ") : p.itens;
            } catch (e) { resumoItens = p.itens; }

            tr.innerHTML = `
                <td>#${p.id}</td>
                <td>
                    <strong>${p.cliente_nome || p.cliente || 'Cliente Anônimo'}</strong><br>
                    <small>${p.telefone || 'Sem contato'}</small>
                </td>
                <td style="font-size: 12px; max-width: 250px;">
                    ${resumoItens}
                </td>
                <td style="font-weight:600; color:#ff9800">
                    ${Number(p.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td><span class="badge ${statusStyle}">${p.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn-action" onclick="alterarStatus(${p.id}, '${p.status}')" style="background: #ff9800; border:none; color:white; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600;">
                        <i class="fas fa-sync-alt"></i> Próximo
                    </button>
                </td>
            `;

            tabela.appendChild(tr);

            // Cálculos do Dashboard (BI)
            totalPedidosHoje++;
            faturamentoAcumulado += Number(p.total);
            if(p.cliente_nome || p.cliente) totalClientesUnicos.add(p.cliente_nome || p.cliente);
        });

        // Atualiza os Cards com os dados reais
        const elPedidos = document.getElementById("totalPedidos");
        const elFaturamento = document.getElementById("faturamento");
        const elClientes = document.getElementById("totalClientes");

        if(elPedidos) elPedidos.innerText = totalPedidosHoje;
        if(elFaturamento) elFaturamento.innerText = faturamentoAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if(elClientes) elClientes.innerText = totalClientesUnicos.size;

    } catch (e) {
        console.error("Erro ao carregar pedidos Elite:", e);
    }
}

/**
 * Altera o status do pedido com fluxo lógico
 */
async function alterarStatus(id, statusAtual) {
    let novoStatus = "";
    const endpointStatus = "/atualizar-status"; // Rota exata definida no seu Worker
    
    if (statusAtual === "novo") novoStatus = "preparando";
    else if (statusAtual === "preparando") novoStatus = "saiu";
    else if (statusAtual === "saiu") novoStatus = "entregue";
    else {
        alert("Este pedido já foi finalizado! ✅");
        return;
    }

    if (confirm(`Mudar pedido #${id} para ${novoStatus.toUpperCase()}?`)) {
        try {
            const res = await fetch(endpointStatus, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: novoStatus })
            });

            if (res.ok) {
                carregar(); 
            } else {
                alert("Erro ao salvar no banco. Verifique o Worker.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor.");
        }
    }
}

// Inicialização e Auto-Refresh (10s)
document.addEventListener("DOMContentLoaded", () => {
    carregar();
    setInterval(carregar, 10000); 
});
