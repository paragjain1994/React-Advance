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

  const fetchMoviesHandler = useCallback(async () => {
    console.log('inside fetchMovieHandler function ')
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://react-http-bb271-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      const cleanInterval = setInterval(async () => {
        await fetch("https://react-http-bb271-default-rtdb.firebaseio.com/movies.json");
      }, 5000);
      setStop(cleanInterval);
    }
    setIsLoading(false);
  },[]);
 
  useEffect(() => {
    console.log('usEffect called')
    fetchMoviesHandler()
  }, []);

 async function addMovieHandler(movie) {
    console.log(movie);
    const response = await fetch(
      "https://react-http-bb271-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
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