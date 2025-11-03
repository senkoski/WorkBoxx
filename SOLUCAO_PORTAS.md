# Solução para Problemas de Porta no WorkBox Backend

## Problema Identificado
O servidor backend está enfrentando problemas de portas já em uso (EADDRINUSE). Várias portas foram testadas (3001, 3002, 5000, 8080, 9999, 4444) e todas apresentaram o mesmo erro.

## Solução Recomendada

### Opção 1: Usar o Prisma Studio
O Prisma Studio está funcionando corretamente na porta 5555, permitindo acesso ao banco de dados:
```
npx prisma studio
```
Acesse: http://localhost:5555

### Opção 2: Liberar portas em uso
Para liberar as portas em uso no Windows, execute os seguintes comandos no PowerShell como administrador:

```powershell
# Identificar processos usando a porta desejada (exemplo: 3001)
netstat -ano | findstr :3001

# Encerrar o processo usando a porta (substitua XXXX pelo PID)
taskkill /PID XXXX /F
```

### Opção 3: Modificar a porta no código
Se necessário, modifique a porta no arquivo `src/index.js` para uma porta não utilizada:

```javascript
// Inicializar aplicação Express
const app = express();
const PORT = 7777; // Escolha uma porta não utilizada
```

## Próximos Passos
1. Após liberar a porta, inicie o servidor com:
   ```
   npm start
   ```
   ou
   ```
   node src/index.js
   ```

2. Verifique se o servidor está funcionando acessando:
   ```
   http://localhost:[PORTA]/api/health
   ```

3. Continue usando o Prisma Studio para gerenciar o banco de dados enquanto resolve os problemas de porta.