from flask import Flask, request, render_template
import json

app = Flask(__name__)

@app.route('/')
def displayHomepage():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=3000)