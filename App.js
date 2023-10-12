
import { useState } from 'react';
import './App.css';
import { getAllPokemon } from './utils/pokemon.js';
import { useEffect } from 'react';
import { getPokemon } from './utils/pokemon.js';
import Card from './components/Card.js';
import Navbar from './components/Navbar.js';
function App() {
  const initialUrl = "https://pokeapi.co/api/v2/pokemon";
  const [loading,setLoading] = useState(true);
  const [pokemonData,setPokemonData] = useState([]);
  const [nextUrl,setNextUrl] = useState("");
  const [prevUrl,setPrevUrl] = useState("");
//Promiseを使うときはasync,awaitが必要
  useEffect(() =>{
    const fetchPokemonData = async () => {
      //get all pokemon data
      let res = await getAllPokemon(initialUrl);
      //get detailed data of pokemons
      //console.log(res.next);
      loadPokemon(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
    
  },[]);
  const loadPokemon = async(data) =>{
    let pokedata = await Promise.all(
      data.map((pokemon) =>{
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(pokedata);
   
  };
  //console.log(pokemonData);

  const handlePrevPage = async() =>{
    if(!prevUrl) return;
    setLoading(true);
    let prevData = await getAllPokemon(prevUrl);
    await loadPokemon(prevData.results);
    setNextUrl(prevData.next);
    setPrevUrl(prevData.previous);
    setLoading(false);
  }
  const handleNextPage = async() =>{
    setLoading(true);
    let nextdata = await getAllPokemon(nextUrl);
    await loadPokemon(nextdata.results);
    setNextUrl(nextdata.next);
    setPrevUrl(nextdata.previous);
    setLoading(false);
  };
  return (
  <>
    <Navbar />
    <div className="App">
      {loading ? (
        <h1>loading...</h1>
      ): (
        <>
        <div className = "pokemonCardContainer">
          {pokemonData.map((pokemon,i) =>{
            //i番目のオブジェクトをpropsで渡す
            return <Card key={i} pokemon = {pokemon}/>;
          })}
        </div>
        <div className='btn'>
          <button onClick = {handlePrevPage}>Back</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
        </>
      )}
    </div>
    </>
  );
}

export default App;
