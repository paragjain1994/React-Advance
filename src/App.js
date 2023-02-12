import React, { useState, useEffect, useCallback } from "react";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stop, setStop] = useState(null);

  console.log('app rendered')

  const fetchMoviesHandler = async () => {
    console.log('inside fetchMovieHandler function ')
    setIsLoading(true);
    console.log(isLoading)
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      console.log('line 34')
      setMovies(transformedMovies);
      console.log('line 36')
    } catch (error) {
      setError(error.message);
      const cleanInterval = setInterval(async () => {
        await fetch("https://swapi.dev/api/films/");
      }, 5000);
      setStop(cleanInterval);
    }
    setIsLoading(false);
  };
 
  useEffect(() => {
    console.log('usEffect called')
    fetchMoviesHandler()
  }, []);

  function addMovieHandler(movie) {
    console.log(movie);
  }

  const stopFetching = () => {
    console.log("Stopped");
    clearInterval(stop);
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        {console.log('inside return')}
        <button onClick={fetchMoviesHandler}>Fetching Movies</button>
      </section>
      <section>
        {content}
        {error && <button onClick={stopFetching}>Stop</button>}
      </section>
    </React.Fragment>
  );
}

export default App;



// after false & before line 34 , by which setter function app is being re-rendered 

// app rendered
// inside return
// usEffect called
// inside fetchMovieHandler function 
// false

// app rendered   => 1st re-rendering       
// inside return

// line 34
// line 36

// app rendered   => 2nd re-rendering
// inside return