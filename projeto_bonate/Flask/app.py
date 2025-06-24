from flask import Flask, render_template, request, jsonify
import requests
import os
import json

app = Flask(__name__, static_folder="static", template_folder="templates")

DB_DIR = os.path.join(os.path.dirname(__file__), "../Banco-de-dados")
url_node = "https://site-de-salgados-node.onrender.com"  # ← Domínio do backend Node

def caminho_carrinho(email):
    email_seguro = "carrinho-" + email.replace("@", "_").replace(".", "_") + ".json"
    return os.path.join(DB_DIR, email_seguro)

def carregar_carrinho(email, criar=False):
    caminho = caminho_carrinho(email)
    if not os.path.exists(caminho):
        if criar:
            with open(caminho, "w", encoding="utf-8") as f:
                json.dump([], f)
        return []
    with open(caminho, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return []

def salvar_carrinho(email, dados):
    caminho = caminho_carrinho(email)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)

@app.route('/carrinho')
def carrinho():
    try:
        email_usuario = request.args.get('email', 'visitante')

        carrinho_response = requests.get(f'{url_node}/carrinho', params={'email': email_usuario})
        carrinho_response.raise_for_status()
        carrinho = carrinho_response.json()

        produtos_response = requests.get(f'{url_node}/produtos')
        produtos_response.raise_for_status()
        produtos = produtos_response.json()

        produtos_carrinho = []
        for item in carrinho:
            prod = next((p for p in produtos if p['id'] == item['id']), None)
            if prod:
                prod_carrinho = prod.copy()
                prod_carrinho['quantidade'] = item['quantidade']
                prod_carrinho['imagem'] = f"{url_node}{prod_carrinho['imagem']}"
                produtos_carrinho.append(prod_carrinho)

        total = sum(p['preco'] * p['quantidade'] for p in produtos_carrinho)

    except Exception as e:
        print("Erro:", e)
        produtos_carrinho = []
        total = 0

    return render_template('carrinho.html', produtos=produtos_carrinho, total=total, email=email_usuario)

@app.route('/atualizar-quantidade', methods=['POST'])
def atualizar_quantidade():
    try:
        dados = request.get_json()
        id = dados.get("id")
        quantidade = dados.get("quantidade")
        email = dados.get("email")

        if id is None or quantidade is None or not email:
            return jsonify({ "erro": "ID, quantidade e email são obrigatórios" }), 400

        carrinho = carregar_carrinho(email, criar=True)
        produto = next((p for p in carrinho if int(p['id']) == int(id)), None)

        if not produto:
            return jsonify({ "erro": "Produto não encontrado no carrinho" }), 404

        quantidade = max(1, min(1000, int(quantidade)))
        produto['quantidade'] = quantidade

        salvar_carrinho(email, carrinho)
        return jsonify({ "mensagem": "Quantidade atualizada com sucesso" })

    except Exception as e:
        print("Erro ao atualizar quantidade:", e)
        return jsonify({ "erro": "Erro interno no servidor" }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # PEGA PORTA DA VARIÁVEL DE AMBIENTE, SENÃO USA 5000
    
    app.run(host="0.0.0.0", port=port)
