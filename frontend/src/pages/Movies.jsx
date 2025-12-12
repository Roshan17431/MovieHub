import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Movies.css';

function Movies() {
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [sortBy, setSortBy] = useState('releaseDate');
  const [direction, setDirection] = useState('DESC');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', page, size, sortBy, direction, title, genre, minRating, maxRating],
    queryFn: () => movieService.getMovies({
      page,
      size,
      sortBy,
      direction,
      ...(title && { title }),
      ...(genre && { 'genres[]': genre }),
      ...(minRating && { minRating }),
      ...(maxRating && { maxRating }),
    }),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleClearFilters = () => {
    setTitle('');
    setGenre('');
    setMinRating('');
    setMaxRating('');
    setPage(0);
  };

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>Browse Movies</h1>
      </div>

      <div className="movies-filters">
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <input
              type="text"
              placeholder="Genre (e.g., Action)"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <input
              type="number"
              placeholder="Min Rating (0-10)"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              min="0"
              max="10"
              step="0.1"
              className="filter-input filter-input-small"
            />
          </div>

          <div className="filter-group">
            <input
              type="number"
              placeholder="Max Rating (0-10)"
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
              min="0"
              max="10"
              step="0.1"
              className="filter-input filter-input-small"
            />
          </div>

          <button type="submit" className="btn-filter">
            Apply Filters
          </button>
          
          <button type="button" onClick={handleClearFilters} className="btn-clear">
            Clear
          </button>
        </form>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="releaseDate">Release Date</option>
            <option value="title">Title</option>
            <option value="rating">Rating</option>
          </select>

          <select 
            value={direction} 
            onChange={(e) => setDirection(e.target.value)}
            className="sort-select"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      {isLoading && <LoadingSpinner message="Loading movies..." />}
      
      {error && (
        <ErrorMessage 
          message={typeof error === 'string' ? error : 'Failed to load movies'} 
        />
      )}

      {data && (
        <>
          <div className="movies-grid">
            {data.content && data.content.length > 0 ? (
              data.content.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <div className="no-movies">
                <p>No movies found. Try adjusting your filters.</p>
              </div>
            )}
          </div>

          {data.content && data.content.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="btn-page"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {page + 1} of {data.totalPages || 1}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= (data.totalPages - 1)}
                className="btn-page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Movies;
