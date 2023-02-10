import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stop, setStop] = useState(null);

  console.log('app rendered')

  const fetchMoviesHandler = useCallback(async () => {
    console.log('inside fetchMovieHandler function ')
    setIsLoading(true);
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
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      const cleanInterval = setInterval(async () => {
        await fetch("https://swapi.dev/api/films/");
      }, 5000);
      setStop(cleanInterval);
    }
    setIsLoading(false);
  },[]);

  useEffect(() => {
    console.log('usEffect called')
    fetchMoviesHandler()
  }, [fetchMoviesHandler]);

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
