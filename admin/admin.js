/**
 * MINDSET ELITE - Admin Engine v4.0
 * Módulo: Gestão de Pedidos & BI (Business Intelligence)
 */

const API_URL = "/api"; // Ajuste para a rota real do seu Worker

async function carregar() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Falha na conexão com a API");

        const data = await res.json();
        
        // Garante compatibilidade com diferentes formatos de retorno do D1
        const pedidos = data.results || data;
        const tabela = document.getElementById("pedidosLista"); // ID atualizado conforme o HTML anterior
        
        if (!tabela) return;
        tabela.innerHTML = "";

        let totalPedidos = 0;
        let faturamento = 0;

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            
            // Lógica de cores para o Status
            const statusClass = p.status === 'novo' ? 'badge-novo' : 'badge-entregue';

            tr.innerHTML = `
                <td>#${p.id}</td>
                <td>
                    <strong>${p.cliente}</strong><br>
                    <small>${p.telefone || ''}</small>
                </td>
                <td style="font-weight:600; color:#ff9800">
                    ${Number(p.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td><span class="badge ${statusClass}">${p.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn-action" onclick="alterarStatus(${p.id}, '${p.status}')">
                        <i class="fas fa-sync-alt"></i> Próximo Passo
                    </button>
                </td>
            `;

            tabela.appendChild(tr);

            totalPedidos++;
            faturamento += Number(p.total);
        });

        // Atualiza os Cards do Dashboard com animação simples
        document.getElementById("totalPedidos").innerText = totalPedidos;
        document.getElementById("faturamento").innerText = faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    } catch (e) {
        console.error("Erro ao carregar pedidos Elite:", e);
    }
}

/**
 * Altera o status do pedido no Banco de Dados
 * @param {number} id - ID do pedido
 * @param {string} statusAtual - Status vindo do banco
 */
async function alterarStatus(id, statusAtual) {
    let novoStatus = "preparando";
    
    if (statusAtual === "novo") novoStatus = "preparando";
    else if (statusAtual === "preparando") novoStatus = "saiu";
    else if (statusAtual === "saiu") novoStatus = "entregue";
    else return alert("Este pedido já foi finalizado!");

    const confirmacao = confirm(`Deseja alterar o pedido #${id} para: ${novoStatus.toUpperCase()}?`);
    
    if (confirmacao) {
        try {
            const res = await fetch(`${API_URL}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: novoStatus })
            });

            if (res.ok) {
                carregar(); // Recarrega a lista imediatamente
            }
        } catch (e) {
            alert("Erro ao conectar com o servidor para atualizar status.");
        }
    }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregar();
    // 10 segundos é o ideal para não sobrecarregar o Worker (plano gratuito tem limites)
    setInterval(carregar, 10000); 
});
