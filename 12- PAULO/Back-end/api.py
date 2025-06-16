from flask import Flask, jsonify, request, send_from_directory
import os
import json

# Caminhos absolutos para evitar erro de leitura/escrita
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.abspath(os.path.join(BASE_DIR, "../Banco-de-dados"))
FRONT_DIR = os.path.abspath(os.path.join(BASE_DIR, "../Front-end/public"))

app = Flask(__name__,
            static_folder=FRONT_DIR,
            static_url_path="/")


# ========== FUNÇÃO SEGURA PARA LER O CARRINHO ==========
def carregar_carrinho():
    caminho = os.path.join(DB_DIR, "carrinho.json")

    if not os.path.exists(caminho):
        with open(caminho, "w", encoding="utf-8") as f:
            json.dump([], f)
        return []

    with open(caminho, "r", encoding="utf-8") as f:
        conteudo = f.read().strip()
        if not conteudo:
            return []
        try:
            return json.loads(conteudo)
        except json.JSONDecodeError:
            return []


# ======= ROTA PRINCIPAL (Serve index.html) =======
@app.route("/")
def home():
    return send_from_directory(FRONT_DIR, "index.html")


# ======= PRODUTOS: Lê produtos.json =======
@app.route("/produtos", methods=["GET"])
def get_produtos():
    caminho = os.path.join(DB_DIR, "produtos.json")
    if not os.path.exists(caminho):
        return jsonify({"erro": "Arquivo produtos.json não encontrado"}), 404
    with open(caminho, "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)


# ======= ADICIONAR AO CARRINHO =======
@app.route("/adicionar", methods=["POST"])
def adicionar_ao_carrinho():
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Requisição inválida"}), 400

    carrinho_path = os.path.join(DB_DIR, "carrinho.json")
    carrinho = carregar_carrinho()

    # Verifica se o produto já está no carrinho
    for item in carrinho:
        if item["id"] == dados["id"]:
            item["quantidade"] += dados.get("quantidade", 1)
            break
    else:
        carrinho.append(dados)

    # Salva de volta no carrinho
    with open(carrinho_path, "w", encoding="utf-8") as f:
        json.dump(carrinho, f, ensure_ascii=False, indent=2)

    return jsonify({"mensagem": "Produto adicionado ao carrinho"}), 200


# ======= RETORNAR CARRINHO =======
@app.route("/carrinho", methods=["GET"])
def get_carrinho():
    carrinho = carregar_carrinho()
    return jsonify(carrinho)


# ======= MAIN =======
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
