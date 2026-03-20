/**
 * MINDSET ELITE - Admin Engine v4.1
 * Módulo: Gestão de Pedidos & BI (Business Intelligence)
 */

const API_URL = "/api"; // Rota do seu Cloudflare Worker

async function carregar() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Falha na conexão com a API");

        const data = await res.json();
        
        // Suporta tanto array direto quanto objeto { results: [] } do Cloudflare D1
        const pedidos = data.results || data;
        const tabela = document.getElementById("pedidosLista");
        
        if (!tabela) return;
        tabela.innerHTML = "";

        let totalPedidosHoje = 0;
        let faturamentoAcumulado = 0;
        let totalClientesUnicos = new Set(); // BI: Conta clientes sem repetir

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            
            // Lógica dinâmica de Badges baseada no status
            let statusStyle = "badge-novo";
            if (p.status === 'entregue') statusStyle = "badge-entregue";
            if (p.status === 'preparando' || p.status === 'saiu') statusStyle = "badge-novo"; // Laranja para atenção

            tr.innerHTML = `
                <td>#${p.id}</td>
                <td>
                    <strong>${p.cliente || 'Cliente Anônimo'}</strong><br>
                    <small>${p.telefone || 'Sem contato'}</small>
                </td>
                <td style="font-size: 12px; max-width: 200px;">
                    ${p.itens || 'Itens não especificados'}
                </td>
                <td style="font-weight:600; color:#ff9800">
                    ${Number(p.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td><span class="badge ${statusStyle}">${p.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn-action" onclick="alterarStatus(${p.id}, '${p.status}')" style="background: #ff9800; border:none; color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">
                        <i class="fas fa-sync-alt"></i> Próximo
                    </button>
                </td>
            `;

            tabela.appendChild(tr);

            // Cálculos do Dashboard
            totalPedidosHoje++;
            faturamentoAcumulado += Number(p.total);
            if(p.cliente) totalClientesUnicos.add(p.cliente);
        });

        // Atualiza os Cards com os dados reais
        document.getElementById("totalPedidos").innerText = totalPedidosHoje;
        document.getElementById("faturamento").innerText = faturamentoAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById("totalClientes").innerText = totalClientesUnicos.size;

    } catch (e) {
        console.error("Erro ao carregar pedidos Elite:", e);
    }
}

/**
 * Altera o status do pedido com fluxo lógico
 */
async function alterarStatus(id, statusAtual) {
    let novoStatus = "";
    
    // Fluxo de trabalho da Benis Burguer
    if (statusAtual === "novo") novoStatus = "preparando";
    else if (statusAtual === "preparando") novoStatus = "saiu";
    else if (statusAtual === "saiu") novoStatus = "entregue";
    else {
        alert("Este pedido já foi finalizado! ✅");
        return;
    }

    if (confirm(`Mudar pedido #${id} para ${novoStatus.toUpperCase()}?`)) {
        try {
            const res = await fetch(`${API_URL}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: novoStatus })
            });

            if (res.ok) {
                carregar(); // Atualiza a tela na hora
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
