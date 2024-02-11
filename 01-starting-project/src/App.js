import React, { useState, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

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

  async function fetchMovieHandler() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/film/");

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      const transformedData = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });

      setMovies(transformedData);
      setRetryCount(0);
    } catch (error) {
      setError("Something went wrong... Retrying");
    }

    setLoading(false);
  }

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
