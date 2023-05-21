import './App.css';
//React
import {useCallback, useEffect, useState} from "react";
//data
import { wordList } from "./data/words"

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

const guessesQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessesLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    //pic a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick a random word 
    const word = words[category][Math.floor(Math.random() * Object.keys(words[category]).length)];
    return {word, category};
  }, [words]);

  //starts the secret word game
  const startGame = useCallback(() => {
    clearLetterStates();
    const {word, category} = pickWordAndCategory();
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
    
  }, [pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();
    //check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    //push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessesLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter

      ])
    } else {
      
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter
        ]);
        setGuesses((actualGuesses) => actualGuesses - 1);
    }
    console.log(guessedLetters);
    console.log(wrongLetters)

  } 

  function clearLetterStates(){
    setGuessesLetters([]);
    setWrongLetters([]);
  }

  //check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      //reset all state
      clearLetterStates();
      setGameStage(stages[2].name);

    }
  }, [guesses]);

  //check win condition
  useEffect(() => {

    const uniqueLetter = [...new Set(letters)];

    //win condition
    if(guessedLetters.length === uniqueLetter.length){
      //add score
      setScore((actualScore) => actualScore+50);
      startGame();
    }

    console.log(uniqueLetter);

  }, [guessedLetters])

  //restarts the game
  const retry = () => {

    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game 
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters} 
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
