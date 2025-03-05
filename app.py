import os
from flask import Flask, request, render_template, jsonify, session
from dotenv import load_dotenv
from data.word_bank import WordBank

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SESSION_KEY")  # Set the session key from the .env file

# Create instance of Word bank to get clusters
word_clusters = WordBank()

@app.route('/')
def displayHomepage():
    return render_template('game.html')

@app.route('/get-cluster', methods=['GET'])
def get_cluster():
    cluster = word_clusters.get_cluster()
    return jsonify({'cluster': cluster})


@app.route('/check-word/<word>', methods=['GET'])
def validate_word(word):
    try:
        with open('data/words_alpha.txt', 'r') as file:
            valid_words = set(word.strip().lower() for word in file)
        word = word.strip().lower()

        # First check if the word exists in dictionary
        if word not in valid_words:
            return jsonify({'valid': False})

        # Then check if it contains the current cluster
        if not word_clusters.current_cluster or word_clusters.current_cluster not in word:
            return jsonify({'valid': False})

        return jsonify({'valid': True})


    except FileNotFoundError:
        print("Warning: words_alpha.txt not found")
        return jsonify({'valid': False})

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

# Get the user's current score
@app.route('/get-score', methods= ['GET'])
def get_score():
    if 'score' not in session:
        session['score'] = 0
    return jsonify({'score': session['score']})

'''Clear the user's score (if they choose not to continue their previous game)'''
@app.route('/reset-game', methods=['POST'])
def reset_game():
    session['score'] = 0
    session.modified = True
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
