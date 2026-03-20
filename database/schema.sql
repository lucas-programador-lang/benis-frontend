-- 1. TABELA DE CLIENTES (Otimizada para buscas por telefone)
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT UNIQUE NOT NULL, -- UNIQUE evita cadastros duplicados
    endereco_padrao TEXT,
    pontos INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE PEDIDOS (Com suporte a histórico e auditoria)
CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER, -- Chave Estrangeira (Opcional no D1, mas bom para organização)
    cliente_nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    endereco TEXT NOT NULL,
    itens TEXT NOT NULL, -- Armazenado como JSON String
    total REAL NOT NULL,
    taxa_entrega REAL DEFAULT 0.0,
    status TEXT DEFAULT 'novo', -- novo, preparando, saiu, entregue, cancelado
    metodo_pagamento TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- 3. TABELA DE CUPONS (Com trava de unicidade)
CREATE TABLE IF NOT EXISTS cupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL, -- Impede criar dois cupons com o mesmo nome
    valor_desconto REAL NOT NULL, -- Pode ser fixo ou porcentagem
    tipo_desconto TEXT DEFAULT 'porcentagem', -- 'fixo' ou 'porcentagem'
    ativo INTEGER DEFAULT 1, -- 1 para Sim, 0 para Não
    expira_em DATETIME
);

-- 4. ÍNDICES DE PERFORMANCE (Deixa o app muito mais rápido)
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
