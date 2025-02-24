import os
from flask import Flask, request, render_template, jsonify, session
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SESSION_KEY")  # Set the session key from the .env file

@app.route('/')
def displayHomepage():
    return render_template('game.html')

@app.route('/update-score', methods=['POST'])
def update_score():
    # Initialize the score if not already set
    if 'score' not in session:
        session['score'] = 0

    # Increase the score
    session['score'] += 1
    session.modified = True

    # Return the updated score as a JSON response
    return jsonify({'score': session['score']})


if __name__ == '__main__':
    app.run(debug=True, port=3000)
