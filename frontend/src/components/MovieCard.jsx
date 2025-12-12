import { Link } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-card-poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <div className="movie-card-placeholder">
            <span>🎬</span>
          </div>
        )}
      </div>
      
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        
        <div className="movie-card-info">
          <span className="movie-genre">{movie.genre}</span>
          <span className="movie-rating">⭐ {movie.rating}/10</span>
        </div>
        
        <div className="movie-card-meta">
          <span className="movie-date">
            {new Date(movie.releaseDate).getFullYear()}
          </span>
          {movie.averageReviewRating !== null && movie.averageReviewRating !== undefined && (
            <span className="movie-reviews">
              👥 {movie.averageReviewRating.toFixed(1)}/5 ({movie.reviewCount || 0} reviews)
            </span>
          )}
        </div>
        
        {movie.description && (
          <p className="movie-card-description">
            {movie.description.length > 100 
              ? `${movie.description.substring(0, 100)}...` 
              : movie.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
