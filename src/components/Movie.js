import React from "react";

import classes from "./Movie.module.css";

const Movie = (props) => {
  async function deleteMovieHandler() {
    console.log(props.id); // id of the movie which has to be deleted!
    const response = await fetch(
      `https://react-http-bb271-default-rtdb.firebaseio.com/movies/${props.id}.json`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.log("Something Went Wrong");
    }
    console.log("deleted");
  }

  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={deleteMovieHandler}>Delete</button>
    </li>
  );
};

export default Movie;
