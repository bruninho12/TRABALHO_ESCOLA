// Script de inicialização do MongoDB com autenticação
// Este arquivo é executado automaticamente pelo Docker quando o container inicia

db.createUser({
  user: "admin",
  pwd: "password",
  roles: [
    {
      role: "root",
      db: "admin",
    },
  ],
});

// Criar banco de dados despfinancee
db = db.getSiblingDB("despfinancee");

// Criar índices e estrutura inicial (opcional)
db.users.createIndex({ email: 1 }, { unique: true });
db.transactions.createIndex({ userId: 1, date: -1 });

print("✅ MongoDB initialized with user admin and database despfinancee");
