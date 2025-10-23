import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ====================================================================
//                          GAME 1: MEMORY MATCH-UP
// ====================================================================

// Configuration
const gameIcons = ['🎂', '🎁', '🎈', '🥳', '👑', '✨', '🍾', '🎶'];
const TOTAL_PAIRS = gameIcons.length;

/**
 * Shuffles an array using the Fisher-Yates (Knuth) algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  const newArray = [...array]; 

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
};

// Component Definition
const MemoryMatch = () => {
  // --- State Management ---
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false); 
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);

  const pairsFound = matchedCards.length;
  const isGameComplete = pairsFound === TOTAL_PAIRS;

  // --- Game Initialization ---
  const initializeGame = useCallback(() => {
    const deck = shuffle([...gameIcons, ...gameIcons]);
    setCards(deck);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setIsLocked(false);
    setIsWinModalOpen(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // --- Game Logic ---
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsLocked(true); 

      const [idx1, idx2] = flippedCards;
      const icon1 = cards[idx1];
      const icon2 = cards[idx2];

      if (icon1 === icon2) {
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, icon1]); 
          setFlippedCards([]); 
          setIsLocked(false); 
        }, 500); 
      } else {
        setTimeout(() => {
          setFlippedCards([]); 
          setIsLocked(false); 
        }, 1000); 
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (isGameComplete) {
      setTimeout(() => {
        setIsWinModalOpen(true);
      }, 500);
    }
  }, [isGameComplete]);

  // --- Event Handlers ---
  const handleCardClick = (index) => {
    if (isLocked || flippedCards.includes(index) || matchedCards.includes(cards[index])) {
      return;
    }

    if (flippedCards.length < 2) {
      setFlippedCards((prev) => [...prev, index]);
    }
  };

  const handleRestart = () => {
    initializeGame();
  };

  // --- Card Component Rendering ---
  const Card = ({ index, icon }) => {
    const isFlipped = flippedCards.includes(index);
    const isMatched = matchedCards.includes(icon);
    const isVisible = isFlipped || isMatched;

    const cardBaseClasses = `
      relative w-full h-full rounded-xl cursor-pointer shadow-lg transition-transform duration-600
      transform-style-preserve-3d perspective-1000
      ${isMatched ? 'opacity-50 scale-95 pointer-events-none' : ''}
    `;

    const cardBackClasses = `
      absolute w-full h-full flex justify-center items-center rounded-xl bg-amber-400
      text-pink-600 text-3xl font-bold backface-hidden transition-opacity duration-300
    `;

    const cardFrontClasses = `
      absolute w-full h-full flex justify-center items-center rounded-xl bg-white
      text-5xl transform rotate-y-180 backface-hidden
    `;

    return (
      <div
        className={cardBaseClasses}
        onClick={() => handleCardClick(index)}
        style={{ transform: isVisible ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className={cardBackClasses}>?</div>
        <div className={cardFrontClasses}>{icon}</div>
      </div>
    );
  };

  // --- Modal Content for Win Screen ---
  const modalContent = useMemo(() => {
    let title = '🥳 Match Found! 🍾';
    let message = `You completed the game in **${moves} moves!**`;

    if (moves <= 18) {
      message = `🎉 Amazing memory! ${message} That's a party-level performance!`;
    } else if (moves <= 26) {
      message = `Nice job! ${message} You found all the gifts.`;
    } else {
      message = `Keep practicing! ${message} Try again for a better score!`;
    }

    return { title, message };
  }, [moves]);

  // --- Component Render ---
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-3xl shadow-2xl h-full w-full max-w-sm">
      <h2 className="text-3xl font-extrabold text-pink-600 drop-shadow-lg mb-2">
        🎂 Match-Up 🎁
      </h2>
      <p className="text-sm mb-4 text-gray-700">
        Find all the pairs!
      </p>

      {/* Game Info */}
      <div className="flex justify-between w-full mb-4 text-lg font-medium px-1">
        <span>
          Moves: <strong className="text-pink-600">{moves}</strong>
        </span>
        <span>
          Pairs: <strong className="text-pink-600"> {pairsFound}/{TOTAL_PAIRS} </strong>
        </span>
      </div>

      {/* Game Board (Grid) */}
      <div
        id="game-board-match"
        className="grid grid-cols-4 gap-2 w-full aspect-square"
      >
        {cards.map((icon, index) => (
          <Card key={index} index={index} icon={icon} />
        ))}
      </div>

      <button
        onClick={handleRestart}
        className="mt-4 bg-pink-600 text-white border-none py-2 px-6 rounded-full text-md font-bold uppercase shadow-lg hover:bg-pink-700 transition"
      >
        Restart
      </button>

      {/* Win Modal */}
      {isWinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center shadow-3xl animate-popIn max-w-sm w-11/12">
            <h3 className="text-2xl font-bold text-pink-600 mb-2">
              {modalContent.title}
            </h3>
            <p
              className="text-lg mb-4 text-gray-700"
              dangerouslySetInnerHTML={{ __html: modalContent.message }}
            />
            <button
              onClick={handleRestart}
              className="bg-pink-600 text-white py-2 px-6 rounded-full text-md font-semibold shadow-lg hover:bg-pink-700 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================================
//                          GAME 2: SNAKE GAME
// ====================================================================

// --- Configuration ---
const TILE_COUNT = 20;
const TILE_SIZE = 20;
const INITIAL_SPEED = 150; 
const SPEED_INCREASE_INTERVAL = 5; 

// --- Direction Key Map ---
const DIRECTION_MAP = {
    ArrowUp: { x: 0, y: -1, key: 'ArrowUp', opposite: 'ArrowDown' },
    ArrowDown: { x: 0, y: 1, key: 'ArrowDown', opposite: 'ArrowUp' },
    ArrowLeft: { x: -1, y: 0, key: 'ArrowLeft', opposite: 'ArrowRight' },
    ArrowRight: { x: 1, y: 0, key: 'ArrowRight', opposite: 'ArrowLeft' },
};

function generateFood(currentSnake) {
    let newFood;
    let collision;
    do {
        collision = false;
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        for (const segment of currentSnake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                collision = true;
                break;
            }
        }
    } while (collision);
    return newFood;
}

const initializeSnake = () => {
    const startX = Math.floor(TILE_COUNT / 2);
    const startY = Math.floor(TILE_COUNT / 2);
    return [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
    ];
};

const SnakeGame = () => {
    // --- State Management for UI ---
    const [score, setScore] = useState(0);
    const [statusText, setStatusText] = useState('SNAKE');
    const [gameRunning, setGameRunning] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED);

    // --- Refs for Game Logic ---
    const canvasRef = useRef(null);
    const gameIntervalRef = useRef(null);
    const snakeRef = useRef(initializeSnake());
    const foodRef = useRef(generateFood(initializeSnake()));
    const velocityRef = useRef({ x: 1, y: 0 }); 
    const lastKeyPressedRef = useRef('ArrowRight'); 
    const isInitialRender = useRef(true);
    
    // --- Game Over Function ---
    const gameOver = useCallback(() => {
        setGameRunning(false);
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
        setStatusText('GAME OVER!');
    }, []);
    
    // --- Drawing Function ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const currentSnake = snakeRef.current;
        const currentFood = foodRef.current;

        // Draw background (Black)
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw food (Red)
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(currentFood.x * TILE_SIZE, currentFood.y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);

        // Draw snake (Green)
        ctx.fillStyle = '#4CAF50';
        ctx.strokeStyle = '#2E7D32';
        currentSnake.forEach((segment, index) => {
            ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
            ctx.strokeRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);

            if (index === 0) {
                ctx.fillStyle = '#8BC34A'; 
                ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
            }
        });
    }, []);

    // --- Game Logic Update ---
    const update = useCallback(() => {
        const currentSnake = snakeRef.current;
        const head = currentSnake[0];
        const { x: xV, y: yV } = velocityRef.current;
        let newHead = { x: head.x + xV, y: head.y + yV };

        // 1. Boundary wrapping 
        if (newHead.x < 0) newHead.x = TILE_COUNT - 1;
        if (newHead.x >= TILE_COUNT) newHead.x = 0;
        if (newHead.y < 0) newHead.y = TILE_COUNT - 1;
        if (newHead.y >= TILE_COUNT) newHead.y = 0;

        // 2. Self-Collision Check
        for (let i = 1; i < currentSnake.length; i++) {
            if (newHead.x === currentSnake[i].x && newHead.y === currentSnake[i].y) {
                gameOver();
                return;
            }
        }

        // 3. Move the snake: Add new head
        currentSnake.unshift(newHead);

        // 4. Check for Food Collision
        const currentFood = foodRef.current;
        
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
            setScore(prevScore => {
                const newScore = prevScore + 1;
                
                if (newScore % SPEED_INCREASE_INTERVAL === 0) {
                    const nextSpeed = Math.max(50, INITIAL_SPEED - Math.floor(newScore / SPEED_INCREASE_INTERVAL) * 10);
                    setCurrentSpeed(nextSpeed);
                    setStatusText('SPEED UP!');
                    setTimeout(() => { if (snakeRef.current.length > 0 && gameRunning) setStatusText('SNAKE'); }, 500);
                }

                return newScore;
            });
            
            foodRef.current = generateFood(currentSnake);
        } else {
            // If no food eaten, remove the tail
            currentSnake.pop();
        }

        snakeRef.current = currentSnake;
        draw();
    }, [draw, gameOver, gameRunning]); 

    // --- Game Control Functions ---
    const startGame = useCallback(() => {
        if (gameRunning) return;
        
        snakeRef.current = initializeSnake();
        foodRef.current = generateFood(snakeRef.current);
        velocityRef.current = { x: 1, y: 0 };
        lastKeyPressedRef.current = 'ArrowRight';
        setScore(0);
        setCurrentSpeed(INITIAL_SPEED);
        setStatusText('SNAKE');

        setGameRunning(true);
        draw(); 
    }, [gameRunning, draw]);

    const handleDirectionChange = useCallback((key) => {
        if (!gameRunning) {
            startGame();
            return;
        }

        const newDir = DIRECTION_MAP[key];
        if (!newDir) return; 

        // Prevent immediate 180-degree reversal
        if (lastKeyPressedRef.current === newDir.opposite) return;

        const currentVelocity = velocityRef.current;
        if (currentVelocity.x !== newDir.x || currentVelocity.y !== newDir.y) {
            velocityRef.current = { x: newDir.x, y: newDir.y };
            lastKeyPressedRef.current = newDir.key;
        }

    }, [gameRunning, startGame]);

    // Effect 1: Game Loop
    useEffect(() => {
        if (gameRunning) {
            if (gameIntervalRef.current) {
                clearInterval(gameIntervalRef.current);
            }
            gameIntervalRef.current = setInterval(update, currentSpeed);
        } else {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
        }

        return () => {
            if (gameIntervalRef.current) {
                clearInterval(gameIntervalRef.current);
            }
        };
    }, [gameRunning, currentSpeed, update]);


    // Effect 2: Input Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                e.preventDefault(); 
                handleDirectionChange(key);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleDirectionChange]); 

    // Effect 3: Initial draw
    useEffect(() => {
        if (isInitialRender.current) {
            draw();
            isInitialRender.current = false;
        }
        
        return () => {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
        };
    }, [draw]);

    // --- Render ---
    const startMessageContent = gameRunning 
        ? null
        : statusText === 'GAME OVER!' 
            ? `GAME OVER! Score: ${score}. <br>Press an Arrow Key to Restart.`
            : 'Press any Arrow Key to Start!';

    return (
        <div className="flex flex-col items-center p-4 bg-[#1e1e1e] rounded-3xl border-8 border-[#333] shadow-2xl w-full max-w-sm">
            <h2 className="text-3xl font-extrabold text-[#4CAF50] drop-shadow-lg mb-2">
                🐍 Classic Snake 🍎
            </h2>

            <div className="flex justify-between w-full mb-4 text-xl font-medium px-1 text-[#4CAF50]">
                <div id="scoreDisplay">SCORE: {String(score).padStart(3, '0')}</div>
                <div id="statusDisplay">{statusText}</div>
            </div>

            <canvas 
                id="gameCanvas" 
                ref={canvasRef}
                className="border-4 border-[#4CAF50] bg-black rounded-md"
                width={TILE_COUNT * TILE_SIZE}
                height={TILE_COUNT * TILE_SIZE}
            ></canvas>

            {startMessageContent && (
                <div 
                    id="startMessage" 
                    className="text-center mt-3 text-lg text-[#FFEB3B]"
                    dangerouslySetInnerHTML={{ __html: startMessageContent }}
                />
            )}
            
            <div className="controls mt-4 w-48 grid grid-cols-3 gap-2">
                <div className="col-start-2">
                    <button className="ctrl-btn w-full" onClick={() => handleDirectionChange('ArrowUp')}>&#9650;</button>
                </div>
                <button className="ctrl-btn" onClick={() => handleDirectionChange('ArrowLeft')}>&#9664;</button>
                <div className="col-start-2 text-transparent">.</div>
                <button className="ctrl-btn" onClick={() => handleDirectionChange('ArrowRight')}>&#9654;</button>
                <div className="col-start-2">
                    <button className="ctrl-btn w-full" onClick={() => handleDirectionChange('ArrowDown')}>&#9660;</button>
                </div>
            </div>
            
        </div>
    );
};


// ====================================================================
//                          FROLIC (DUAL GAME CONTAINER)
// ====================================================================

const Frolic = () => {
  return (
    <>
        {/* Global Styles */}
        <style global jsx="true">{`
            @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
            
            /* Snake Game Specific Styles */
            .snake-body, .ctrl-btn { font-family: 'VT323', monospace; }
            .ctrl-btn {
                font-size: 1.2rem;
                padding: 5px;
                cursor: pointer;
                border-radius: 8px;
                background: linear-gradient(145deg, #4CAF50, #388E3C);
                color: #fff;
                border: none;
                box-shadow: 0 3px #2E7D32;
                transition: all 0.1s ease;
                user-select: none;
            }
            .ctrl-btn:active {
                box-shadow: 0 1px #2E7D32;
                transform: translateY(2px);
                background: linear-gradient(145deg, #388E3C, #4CAF50);
            }
            
            /* Memory Match Specific Styles */
            @keyframes popIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .transform-style-preserve-3d { transform-style: preserve-3d; }
            .perspective-1000 { perspective: 1000px; }
            .backface-hidden { backface-visibility: hidden; }
            .animate-popIn { animation: popIn 0.3s ease-out forwards; }
        `}</style>

        <div
            className="min-h-screen flex flex-col items-center p-5 space-y-8 lg:space-y-0 lg:flex-row lg:justify-center lg:space-x-12"
            style={{
                background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
                fontFamily: 'Inter, sans-serif',
                color: '#333',
            }}
        >
            <h1 className="text-4xl lg:hidden font-extrabold text-gray-800 drop-shadow-md">Dual Arcade Mode</h1>
            
            {/* Left Side: Memory Match */}
            <MemoryMatch />

            {/* Right Side: Snake Game */}
            <SnakeGame />
        </div>
    </>
  );
};

export default Frolic;