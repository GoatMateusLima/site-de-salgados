from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route('/carrinho')
def carrinho():
    try:
        response = requests.get('http://localhost:8080/carrinho')
        response.raise_for_status()
        produtos = response.json()
    except requests.RequestException as e:
        print('Erro ao acessar a API Node.js:', e)
        produtos = []

    total = sum(item['preco'] * item['quantidade'] for item in produtos)
    print(produtos)
    return render_template('carrinho.html', produtos=produtos, total=total)

if __name__ == '__main__':
    app.run(debug=True, port=5000)