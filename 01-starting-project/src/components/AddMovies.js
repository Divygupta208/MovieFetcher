import React, { useRef } from "react";
import "./AddMovies.css";
const AddMovies = (props) => {
  const nameRef = useRef();
  const openingRef = useRef();
  const dateRef = useRef();

  const onAddMovie = (event) => {
    event.preventDefault();
    const newMovieObj = {
      title: nameRef.current.value,
      openingText: openingRef.current.value,
      releaseDate: dateRef.current.value,
    };

    props.addMovieHandler(newMovieObj);

    nameRef.current.value = "";
    openingRef.current.value = "";
    dateRef.current.value = "";
  };

  return (
    <div className="add-movie">
      <form className="form">
        <lable htmlFor="name">Name</lable>
        <input type="text" id="name" ref={nameRef} />
        <label htmlFor="opening">Opening Text</label>
        <input
          className="opening-input"
          type="text"
          id="opening"
          ref={openingRef}
        />
        <label htmlFor="date">Release Date</label>
        <input type="date" id="date" ref={dateRef} />

        <button onClick={onAddMovie}>Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovies;
