CREATE TABLE pedidos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

cliente TEXT,

telefone TEXT,

endereco TEXT,

itens TEXT,

total REAL,

status TEXT,

data DATETIME DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE produtos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

preco REAL,

categoria TEXT

);
