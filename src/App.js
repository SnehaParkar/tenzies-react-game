import React from 'react';
import { nanoid } from 'nanoid';
import ReactDOM from 'react-dom/client';
import './assets/App.css';
import ReactConfetti from "react-confetti";
import Footer from './components/Footer';
import Die from './components/Die';

function App() {
  // Create state to hold our array of numbers
  const [dice, setDice] = React.useState(allNewDice());

  // Create state to hold our game state
  const [tenzies, setTenzies] = React.useState(false);

  // Scores :  rolls and time
  // Create and initialize states to hold rolls stats
  const [rolls, setRolls] = React.useState(0);
  const [bestRolls, setBestRolls] = React.useState(
    JSON.parse(localStorage.getItem("bestRolls")) || 0
  );

  // Create and initialize states to hold time stats
  const [bestTime, setBestTime] = React.useState(
    JSON.parse(localStorage.getItem("bestTime")) || 0
  );
  const [time, setTime] = React.useState(0);
  const [start, setStart] = React.useState(true);

  //========================================
  // Use Effects
  // useEffect to sync 2 different states together
  React.useEffect(() => {
    // Check all dice are held
    const allHeld = dice.every((die) => die.isHeld);
    // Check all dice have same value
    // Check if every die's value has the same one as the first die in dice array
    const allSameValue = dice.every((die) => die.value === dice[0].value);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setStart(false);

      setRecords();
    }
  }, [dice]);

  // Set bestRolls to localStorage every item bestRolls changes
  React.useEffect(() => {
    localStorage.setItem("bestRolls", JSON.stringify(bestRolls));
  }, [bestRolls]);

  // Set bestTime to localStorage every item bestTime changes
  React.useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
  },
    [bestTime]);

  // Timer function
  React.useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start]);


  //==================================================
  // Helper function

  function setRecords() {
    // Check if bestRolls doesn't exist or newest rolls are better than bestRolls if so reassign the variable
    if (!bestRolls || rolls < bestRolls) {
      setBestRolls(rolls);
    }

    const timeFloored = Math.floor(time / 10);
    // Check if bestTime doesn't exist or newest time is lower than bestTime if so reassign the variable
    if (!bestTime || timeFloored < bestTime) {
      setBestTime(timeFloored);
    }
  }

  function holdDice(id) {
    // Update dice state using old one
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ?
          { ...die, isHeld: !die.isHeld }
          : die;
      })
    );
  }

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 1; i <= 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  // Clicking the button should generate a new array of numbers
  // and set the `dice` state to that new array (thus re-rendering
  // the array to the page)
  function rollDice() {
    if (!tenzies) {
      // Update dice state using old one
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ?
            die
            : generateNewDie();
        })
      );
      updateRolls();
    } else {
      // Reset the game if user won and click on button
      resetGame();
    }
  }

  // Increase rolls counter updating previous state
  function updateRolls() {
    return setRolls((oldRolls) => oldRolls + 1);
  }

  function resetGame() {
    setTenzies(false);
    setDice(allNewDice());
    setRolls(0);
    setTime(0);
    setStart(true);
  }


  const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)

  return (
    <div className="App">
      {/* Render Confetti component if `tenzies` is true*/}
      {tenzies && <ReactConfetti />}

      <main>
        <div className="Scoreboard">
          <div className="stats-container">
            <div className="rolls-best">
              <p className="title">Best rolls</p>
              <p className='value'>{bestRolls}</p>
            </div>
            <div className="time-best">
              <p className="title">Best time</p>
              {/* Convert milliseconds in seconds */}
              <p className='value'>{bestTime / 100}s</p>
            </div>
          </div>
        </div>
        <div className="game-title">
          <h1>Tenzies</h1>
        </div>
        {!tenzies && (
          <p className="instructions">
            Roll until all dice are the same.
            <br /> Click each die to freeze it at its current value between
            rolls.
          </p>
        )}
        {tenzies && <p className="winner-text"> YOU WON!</p>}

        <div className='dice-container'>
          {diceElements}
        </div>
        <button
          className='roll-button'
          onClick={rollDice} >
          {tenzies ? "New Game" : "Roll"}
        </button>

        <div className="current-stats-container">
          <div className='score'><span>Rolls</span> {rolls}</div>
          <div className='score'>
            {/* divide the time by 10 because that is the value of a millisecond
            then modulo 1000. Now we will append this to a zero so that when the time starts
            there will be a zero already instead of just one digit. 
            Finally we will slice and pass in a parameter of -2 so that when the 
            number becomes two digits the zero will be removed */}
            <span>Timer</span> {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
            {("0" + ((time / 10) % 1000)).slice(-2)}
          </div>
        </div>


      </main>
      <Footer />
    </div>
  );
}

export default App;
