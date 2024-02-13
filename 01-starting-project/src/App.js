import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovies from "./components/AddMovies";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [can, setCan] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (can && error && retryCount < 3) {
      const retryTimer = setInterval(() => {
        setRetryCount((prevRetryCount) => prevRetryCount + 1);
        fetchMovieHandler();
      }, 5000);

      return () => {
        clearInterval(retryTimer);
      };
    }
  }, [can, error, retryCount]);

  const fetchMovieHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-http-7951f-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      const loadedData = [];

      for (const key in data) {
        loadedData.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedData);
      setRetryCount(0);
    } catch (error) {
      setError("Something went wrong... Retrying");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        "https://react-http-7951f-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add movie. Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Movie added successfully:", data);
    } catch (error) {
      console.error("Error adding movie:", error.message);
    }
  };

  let content = <p>Found No Movies</p>;

  const handleCancelRetry = () => {
    setCan(false);
    setRetryCount(0);
    content = <p>Thanks For Visiting...!</p>;
  };

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = (
      <div>
        {retryCount < 3 ? (
          <>
            <p>{error}</p>
            <button onClick={handleCancelRetry}>Cancel Retry</button>
          </>
        ) : (
          <p>Please try again later.</p>
        )}
      </div>
    );
  }
  if (isLoading) {
    content = <span className="visually-hidden">Loading...</span>;
  }

  return (
    <React.Fragment>
      <AddMovies addMovieHandler={addMovieHandler} />
      <section>
        <button
          onClick={() => {
            setCan(true);
            setRetryCount(0);
            fetchMovieHandler();
          }}
        >
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
