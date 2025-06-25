from flask import Flask, render_template, request, jsonify
import requests
import os
from urllib.parse import urljoin

app = Flask(__name__)

# Configuração da URL da API Node (use sua URL)
API_BASE_URL = "https://site-de-salgados-node.onrender.com"

@app.after_request
def log_requests(response):
    app.logger.info(
        f"{request.remote_addr} {request.method} {request.path} {response.status_code}"
    )
    return response

# Rota principal do carrinho
@app.route('/carrinho')
def carrinho():
    try:
        email_usuario = request.args.get('email', 'visitante')
        
        # Endpoints da API
        carrinho_url = urljoin(API_BASE_URL, '/carrinho')
        produtos_url = urljoin(API_BASE_URL, '/produtos')
        
        # Headers para melhor identificação no backend
        headers = {
            'User-Agent': 'FlaskFrontend/1.0',
            'X-Requested-With': 'XMLHttpRequest'
        }
        
        # Requisições paralelas (melhor performance)
        carrinho_response = requests.get(carrinho_url, 
                                      params={'email': email_usuario}, 
                                      headers=headers,
                                      timeout=10)
        produtos_response = requests.get(produtos_url, 
                                      headers=headers,
                                      timeout=10)
        
        # Verifica status das respostas
        carrinho_response.raise_for_status()
        produtos_response.raise_for_status()
        
        # Processa os dados
        carrinho_itens = carrinho_response.json()
        produtos = produtos_response.json()

        # Combina os dados do carrinho com informações dos produtos
        produtos_carrinho = []
        for item in carrinho_itens:
            produto = next((p for p in produtos if str(p['id']) == str(item['id'])), None)
            if produto:
                produto_completo = {
                    **produto,
                    'quantidade': item['quantidade'],
                    'imagem': urljoin(API_BASE_URL, produto['imagem'])
                }
                produtos_carrinho.append(produto_completo)

        # Calcula o total
        total = sum(p['preco'] * p['quantidade'] for p in produtos_carrinho)

    except requests.exceptions.RequestException as e:
        print(f"Erro na API: {str(e)}")
        produtos_carrinho = []
        total = 0
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")
        produtos_carrinho = []
        total = 0

    return render_template('carrinho.html', 
                         produtos=produtos_carrinho, 
                         total=total, 
                         email=email_usuario,
                         api_url=API_BASE_URL)

# Rotas de API (ajustadas para seu endpoint)
@app.route('/atualizar-quantidade', methods=['POST'])
def atualizar_quantidade():
    try:
        dados = request.get_json()
        
        if not all(k in dados for k in ['id', 'quantidade', 'email']):
            return jsonify({"erro": "Dados incompletos"}), 400
            
        response = requests.post(
            urljoin(API_BASE_URL, '/atualizar-quantidade'),
            json=dados,
            timeout=8
        )
        
        return jsonify(response.json()), response.status_code

    except requests.exceptions.Timeout:
        return jsonify({"erro": "Tempo de resposta excedido"}), 504
    except requests.exceptions.RequestException:
        return jsonify({"erro": "Falha na comunicação com o servidor"}), 502
    except Exception as e:
        print(f"Erro: {str(e)}")
        return jsonify({"erro": "Erro interno"}), 500

@app.route('/excluir-item', methods=['POST'])
def excluir_item():
    try:
        dados = request.get_json()
        
        if not all(k in dados for k in ['id', 'email']):
            return jsonify({"erro": "Dados incompletos"}), 400
            
        response = requests.post(
            urljoin(API_BASE_URL, '/excluir'),
            json=dados,
            timeout=8
        )
        
        return jsonify(response.json()), response.status_code

    except requests.exceptions.Timeout:
        return jsonify({"erro": "Tempo de resposta excedido"}), 504
    except requests.exceptions.RequestException:
        return jsonify({"erro": "Falha na comunicação com o servidor"}), 502
    except Exception as e:
        print(f"Erro: {str(e)}")
        return jsonify({"erro": "Erro interno"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)