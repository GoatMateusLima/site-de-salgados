const estadosDiv = document.getElementById("lista-estados");
const cidadesDiv = document.getElementById("lista-cidades");

// Exemplo de dados
const estadosECidades = {
  "São Paulo": ["São Paulo", "Campinas", "Santos"],
    "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Duque de Caxias"],
    "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista"],
    "Paraná": ["Curitiba", "Londrina", "Maringá"],
    "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas"],
    "Pernambuco": ["Recife", "Jaboatão", "Olinda"],
    "Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte"]
};

// Criação dos botões
for (const estado in estadosECidades) {
  const botao = document.createElement("button");
  botao.textContent = estado;
  botao.addEventListener("click", () => {
    cidadesDiv.innerHTML = `<h3>${estado}</h3>`;
    estadosECidades[estado].forEach(cidade => {
      const div = document.createElement("div");
      div.className = "cidade";
      div.textContent = cidade;
      cidadesDiv.appendChild(div);
    });
  });
  estadosDiv.appendChild(botao);
}
