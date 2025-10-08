# Estruturas de Dados

## map - Transforma cada elemento de um array e retorna um novo array.
```javascript
const numeros = [1, 2, 3, 4];
const dobro = numeros.map(num => num * 2);
console.log(dobro); // [2, 4, 6, 8]
```

## filter - Filtra elementos com base em uma condição.
```javascript
const numeros = [1, 2, 3, 4];
const pares = numeros.filter(num => num % 2 === 0);
console.log(pares); // [2, 4]
```

## reduce - Reduz o array a um único valor (ex: soma, produto).
```javascript
const numeros = [1, 2, 3, 4];
const soma = numeros.reduce((acumulador, num) => acumulador + num, 0);
console.log(soma); // 10
```

## find - Encontra o primeiro elemento que satisfaz uma condição.
```javascript
const utilizadores = [{ id: 1, nome: "Ana" }, { id: 2, nome: "João" }];
const utilizador = utilizadores.find(u => u.id === 2);
console.log(utilizador); // { id: 2, nome: "João" }
```

## some/every - Verifica se algum/todos os elementos satisfazem uma condição
```javascript
const temPar = numeros.some(num => num % 2 === 0); // true
const todosPares = numeros.every(num => num % 2 === 0); // false
```

## Destructuring de Matrizes - Extrai valores de uma matriz para variáveis.
```javascript
const cores = ["vermelho", "verde", "azul"];
const [primeiraCor, segundaCor] = cores;
console.log(primeiraCor); // "vermelho"
console.log(segundaCor);  // "verde"
```

## Ignorar Valores Indesejados
```javascript
const [primeiro, , terceiro] = [10, 20, 30];
console.log(primeiro); // 10
console.log(terceiro); // 30
```

## Destructuring com split
```javascript
const data = "2025-10-08";
const [ano, mes, dia] = data.split("-");
console.log(ano); // "2025"
```

## Destructuring aninhado
```javascript
const [primeiro, [segundo]] = [1, [2, 3]];
console.log(segundo); // 2
```

## Trocar Valores de Variáveis Sem Variável Temporária
```javascript
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a); // 2
console.log(b); // 1
```

## Atribuir Valores Padrão
```javascript
const [nome = "Desconhecido", idade = 0] = [];
console.log(nome); // "Desconhecido"
```

## Destructuring de Objetos - Extrai propriedades de um objeto.
```javascript
const pessoa = { nome: "Maria", idade: 25 };
const { nome, idade } = pessoa;
console.log(nome); // "Maria"
console.log(idade); // 25
```

## Renomear variáveis no destructuring
```javascript
const pessoa = { nome: "Maria", idade: 25 };
const { nome: nomePessoa, idade: anos } = pessoa;
console.log(nomePessoa); // "Maria"
console.log(anos); // 25
```

## Extrair Elementos de Object.entries()
```javascript
const pessoa = { nome: "Nuno", idade: 30 };
for (const [chave, valor] of Object.entries(pessoa)) {
  console.log(`${chave}: ${valor}`);
}
// "nome: Nuno"
// "idade: 30"
```

## Desestruturar Parâmetros de Função
```javascript
function exibeCoordenadas([x, y]) {
  console.log(`X: ${x}, Y: ${y}`);
}
exibeCoordenadas([10, 20]); // "X: 10, Y: 20"
```

## Spread Operator (...) - Expande elementos de uma matriz/objeto.
```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log(arr2); // [1, 2, 3, 4]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2); // { a: 1, b: 2, c: 3 }
```

## Rest Operator (...) - Agrupa elementos restantes numa matriz.
```javascript
const [primeiro, ...resto] = [1, 2, 3, 4];
console.log(primeiro); // 1
console.log(resto);    // [2, 3, 4]

function soma(...numeros) {
  return numeros.reduce((acc, num) => acc + num, 0);
}
console.log(soma(1, 2, 3)); // 6
```


# Criar e Formatar Datas
## Data atual:
```javascript
const agora = new Date();
console.log(agora); // Ex: "2025-10-08T12:34:56.789Z"
```

## Formatação personalizada:
```javascript
const data = new Date();
const dia = String(data.getDate()).padStart(2, '0');
const mes = String(data.getMonth() + 1).padStart(2, '0');
const ano = data.getFullYear();
console.log(`${dia}/${mes}/${ano}`); // "08/10/2025"
```
## Verificar se uma data é anterior/posterior a outra.
```javascript
const hoje = new Date();
const ontem = new Date(hoje);
ontem.setDate(hoje.getDate() - 1);
if (hoje > ontem) {
    console.log("Hoje é depois de ontem.");
}
```
## Calcular tempo decorrido (ex: "Faltam 5 dias").
```javascript
const dataEvento = new Date("2025-10-15");
const hoje = new Date();
const diffEmMilissegundos = dataEvento - hoje;
const diffEmDias = Math.ceil(diffEmMilissegundos / (1000 * 60 * 60 * 24));
console.log(`Faltam ${diffEmDias} dias.`);
```

## Converter strings em datas e vice-versa.
```javascript
// String para Date
const dataString = "2025-10-08";
const data = new Date(dataString);

// Date para string localizada
console.log(data.toLocaleDateString('pt-PT')); // "08/10/2025"
```

## Adicionar/Subtrair Tempo
```javascript
const data = new Date();
data.setDate(data.getDate() + 7); // Adiciona 7 dias
console.log(data);
```

# Temporizadores (setTimeout e setInterval)
## Executar Código Após um Delay (setTimeout)
```javascript
setTimeout(() => {
   console.log("Esta mensagem aparece após 3 segundos.");
}, 3000);
```

## Executar Código Repetidamente (setInterval)
```javascript
const intervalId = setInterval(() => {
    console.log("Atualizando dados...");
}, 5000); // A cada 5 segundos
// Para parar:
clearInterval(intervalId);
```

## Debounce e Throttle
```javascript
let timeoutId;
window.addEventListener('resize', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            console.log("Redimensionamento concluído.");
        }, 300);
        });
```

## Animações Simples
```javascript
let opacidade = 0;
const timer = setInterval(() => {
    opacidade += 0.1;
    console.log(opacidade);
    if (opacidade >= 1) clearInterval(timer);
}, 100);
````

## Cancelar Temporizadores
```javascript
const timeoutId = setTimeout(() => {
console.log("Isso não será executado.");
}, 5000);

clearTimeout(timeoutId); // Cancela o timeout
```

## Combinação de Datas e Temporizadores
```javascript
function agendarLembrete(hora) {
   const agora = new Date();
   const lembrete = new Date(agora);
   lembrete.setHours(hora, 0, 0, 0);
    const delay = lembrete - agora;
    if (delay > 0) {
    setTimeout(() => {
        console.log("Hora do lembrete!");
    }, delay);
    }
}
agendarLembrete(9); // Agenda para 9h
```

## Contagem Regressiva
```javascript
function contagemRegressiva(segundos) {
    const intervalId = setInterval(() => {
    console.log(segundos);
    segundos--;
    if (segundos < 0) {
        clearInterval(intervalId);
        console.log("Tempo esgotado!");
    }
    }, 1000);
}
contagemRegressiva(10);
```

# WebSockets e comunicações em tempo real

## Conversa em Tempo Real
```javascript 
//Servidor (Node.js):
const io = require("socket.io")(3000);
io.on("connection", (socket) => {
    socket.on("mensagem", (msg) => {
    io.emit("mensagem", msg); // Envia para todos os clientes
    });
});
```
```javascript
// cliente
const socket = io("http://localhost:3000");
    socket.emit("mensagem", "Olá, mundo!");
    socket.on("mensagem", (msg) => {
  console.log("Nova mensagem:", msg);
});
```

## Notificações em Tempo Real
```javascript
// servidor
socket.on("novo-pedido", (pedido) => {
  io.emit("notificacao", { tipo: "pedido", dados: pedido });
});
```
```javascript
// cliente
socket.on("notificacao", (data) => {
  alert(`Novo ${data.tipo}: ${JSON.stringify(data.dados)}`);
});
```

## Streaming de Dados
```javascript
// servidor
setInterval(() => {
  const dados = obterDadosSensor();
  io.emit("dados-sensor", dados);
}, 1000);
```
```javascript
// cliente
socket.on("dados-sensor", (dados) => {
    atualizarGrafico(dados);
});
```


## Server-Sent Events (SSE)
### Atualizações de Status
```javascript
// Servidor
app.get("/status", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  setInterval(() => {
    res.write(`data: ${obterStatus()}\n\n`);
  }, 1000);
});
```
```javascript
// cliente
const eventSource = new EventSource("/status");
    eventSource.onmessage = (e) => {
    console.log("Status:", e.data);
};
```
### Notificações de Servidor
```javascript
// Servidor
res.write(`data: {"tipo": "alerta", "mensagem": "Servidor sobrecarregado"}\n\n`);
```
```javascript
// Cliente
eventSource.addEventListener("alerta", (e) => {
    alert(JSON.parse(e.data).mensagem);
});
```
###  Feed de Notícias em Tempo Real
```javascript
// Servidor
res.write(`data: ${JSON.stringify({ titulo: "Notícia urgente", texto: "..." })}\n\n`);
```
```javascript
// Cliente

```

