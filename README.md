# 🎯 Jeopardy!

A fully interactive browser-based Jeopardy! game built with JavaScript, jQuery, and the Rithm Jeopardy API.

## 🎮 How to Play

1. Click **"Start the Game!"** to load 6 random categories with 5 clues each.
2. Click any dollar value on the board to reveal a question.
3. Click the question to reveal the answer.
4. Click the answer to dismiss it and continue playing.
5. Once all clues have been answered, the game ends and you can restart!

## 🛠️ Technologies Used

- **HTML5** – Page structure and game board layout
- **CSS3** – Jeopardy-themed styling (blue/gold color scheme)
- **JavaScript (ES6+)** – Game logic and DOM manipulation
- **jQuery** – DOM selection and event handling
- **Axios** – HTTP requests to the API
- **Lodash** – Random sampling of categories and clues

## 📡 API

This project uses the [Rithm Jeopardy API](https://rithm-jeopardy.herokuapp.com/api):

| Endpoint | Description |
|----------|-------------|
| `GET /categories?count=100` | Fetch a list of categories |
| `GET /category?id={id}` | Fetch a specific category with its clues |

## 📁 Project Structure

```
jeopardy/
├── index.html      # Main HTML page
├── jeopardy.js     # Game logic (API calls, DOM updates, event handlers)
├── style.css       # Jeopardy-themed styles
└── README.md       # This file
```

## 🚀 Getting Started

No build tools required! Simply open `index.html` in your browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/jeopardy.git

# Open in browser
open index.html
```

Or just double-click `index.html` to launch the game.

## 🎨 Features

- Randomly selected categories each game for replayability
- Loading spinner while fetching data from the API
- Clues are marked as viewed (strikethrough) after being clicked
- Game automatically detects when all clues are answered
- Restart button to play again with new categories

## 📝 License

This project was built as a educational assignment. Feel free to use and modify.
