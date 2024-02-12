import React, { useRef } from "react";
import "./AddMovies.css";
const AddMovies = () => {
  const nameRef = useRef();
  const openingRef = useRef();
  const dateRef = useRef();

  const addMovieHandler = (event) => {
    event.preventDefault();
    const newMovieObj = {
      name: nameRef.current.value,
      opening: openingRef.current.value,
      date: dateRef.current.value,
    };

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

        <button onClick={addMovieHandler}>Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovies;
