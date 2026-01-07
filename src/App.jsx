import "./App.css";
import { useEffect, useState, useRef } from "react";
import { CardGrid } from "./components/cardGrid";
import { ScoreBoard } from "./components/scoreBoard";

const api_key = "K8xtbkqUY5E2k3b5iADxmfm1vGUfJX82";

function App() {
  const [gameState, setGameState] = useState("start");
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const startDialogRef = useRef(null);

  const dificulltyLevel = {
  easy:   { pool: 20, display: 16 },
  medium: { pool: 20, display: 12 },
  hard:   { pool: 20, display: 8 },
  };

  const startGame = (level) => {
    setDifficulty(level);
    setCurrentScore(0);
    setClickedCards([]);
    setGameState("playing");
  };

  const fetchCards = (level) => {
    const { pool, display } = dificulltyLevel[level];
    const offset = Math.floor(Math.random() * 300);

    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=pokemon&limit=${pool}&offset=${offset}&rating=g`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.data.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.images.fixed_height.url,
        }));

        setAllCards(formatted);
        setCards(shuffle(formatted).slice(0, display));
      })
      .catch((err) => {
        console.error("Error fetching cards:", err);
      });
  };

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
  if (startDialogRef.current) {
    startDialogRef.current.showModal();
  }
}, []);
  

  useEffect(() => {
    if (!difficulty) return;
    fetchCards(difficulty);
  }, [difficulty]);


  const handleCardClick = (cardId) => {
    if (clickedCards.includes(cardId)) {
      setGameState("gameover");
      return;
    }

    const newScore = currentScore + 1;
    setCurrentScore(newScore);
    setClickedCards((prev) => [...prev, cardId]);

    if (newScore > bestScore) {
      setBestScore(newScore);
    }

  const winScore = dificulltyLevel[difficulty].pool;
  if (newScore === winScore) {
    setGameState("win");
    return;
  }

    reshuffleFromPool();
  };

  const reshuffleFromPool = () => {
  if (!allCards.length || !difficulty) return;
  const { display } = dificulltyLevel[difficulty];
  setCards(shuffle(allCards).slice(0, display));
};


const resetGame = () => {
  setGameState("start");
  setCurrentScore(0);
  setClickedCards([]);
  setCards([]);
  setAllCards([]);
  setDifficulty(null);
};




  return (
    <>
      {gameState === "start" && (
        <dialog ref={startDialogRef} className="startScreen">
          <h1>PokéMemory</h1>
          <button onClick={() => {startDialogRef.current.close(); startGame("easy");}}>Easy</button>
          <button onClick={() => {startDialogRef.current.close(); startGame("medium");}}>Medium</button>
          <button onClick={() => {startDialogRef.current.close(); startGame("hard");}}>Hard</button>
        </dialog>
      )}
      {gameState === "playing" && (
        <div className="layout">
          <ScoreBoard current={currentScore} best={bestScore} />
          <CardGrid cards={cards} onCardClick={handleCardClick} />
        </div>
      )}

      {gameState === "gameover" && (
        <div className="gameOver">
          <h2>Game Over 💥</h2>
          <p>Your Score: {currentScore}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      {
        gameState === "win" && (
  <div className="winScreen">
    <h2>🎉 You Win!</h2>
    <p>Perfect Memory!</p>
    <p>Score: {currentScore}</p>
    <button onClick={resetGame}>Play Again</button>
  </div>
)
      }

     
    </>
  );
}

export default App;
