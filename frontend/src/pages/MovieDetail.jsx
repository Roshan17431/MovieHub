import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '../services/movieService';
import { reviewService } from '../services/reviewService';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = authService.isAdmin();
  const userInfo = authService.getUserInfo();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [error, setError] = useState('');

  // Fetch movie details
  const { data: movie, isLoading: movieLoading, error: movieError } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieById(id),
  });

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getReviews(id),
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => reviewService.createReview(id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', id]);
      queryClient.invalidateQueries(['movie', id]);
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewComment('');
      setError('');
    },
    onError: (err) => {
      setError(typeof err === 'string' ? err : 'Failed to create review');
    },
  });

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, reviewData }) => 
      reviewService.updateReview(id, reviewId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', id]);
      queryClient.invalidateQueries(['movie', id]);
      setEditingReview(null);
      setReviewRating(5);
      setReviewComment('');
      setError('');
    },
    onError: (err) => {
      setError(typeof err === 'string' ? err : 'Failed to update review');
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(id, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', id]);
      queryClient.invalidateQueries(['movie', id]);
    },
    onError: (err) => {
      alert(typeof err === 'string' ? err : 'Failed to delete review');
    },
  });

  // Delete movie mutation (admin only)
  const deleteMovieMutation = useMutation({
    mutationFn: () => movieService.deleteMovie(id),
    onSuccess: () => {
      navigate('/movies');
    },
    onError: (err) => {
      alert(typeof err === 'string' ? err : 'Failed to delete movie');
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setError('');

    const reviewData = {
      rating: reviewRating,
      comment: reviewComment,
    };

    if (editingReview) {
      updateReviewMutation.mutate({ reviewId: editingReview.id, reviewData });
    } else {
      createReviewMutation.mutate(reviewData);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setShowReviewForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowReviewForm(false);
    setReviewRating(5);
    setReviewComment('');
    setError('');
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const handleDeleteMovie = () => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      deleteMovieMutation.mutate();
    }
  };

  if (movieLoading) return <LoadingSpinner message="Loading movie..." />;
  if (movieError) return <ErrorMessage message="Failed to load movie" />;
  if (!movie) return <ErrorMessage message="Movie not found" />;

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <div className="movie-detail-poster">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} />
          ) : (
            <div className="movie-detail-placeholder">🎬</div>
          )}
        </div>

        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          
          <div className="movie-detail-meta">
            <span className="movie-detail-genre">{movie.genre}</span>
            <span className="movie-detail-rating">⭐ {movie.rating}/10</span>
            <span className="movie-detail-date">
              {new Date(movie.releaseDate).toLocaleDateString()}
            </span>
          </div>

          {movie.averageReviewRating !== null && movie.averageReviewRating !== undefined && (
            <div className="movie-detail-reviews-summary">
              <span className="review-average">
                👥 User Rating: {movie.averageReviewRating.toFixed(1)}/5
              </span>
              <span className="review-count">
                ({movie.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          {movie.description && (
            <div className="movie-detail-description">
              <h2>Description</h2>
              <p>{movie.description}</p>
            </div>
          )}

          {isAdmin && (
            <div className="admin-actions">
              <button 
                onClick={() => navigate(`/admin/movies/${id}`)}
                className="btn-edit"
              >
                Edit Movie
              </button>
              <button 
                onClick={handleDeleteMovie}
                className="btn-delete"
                disabled={deleteMovieMutation.isPending}
              >
                {deleteMovieMutation.isPending ? 'Deleting...' : 'Delete Movie'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews</h2>
          {!showReviewForm && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="btn-add-review"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>{editingReview ? 'Edit Review' : 'Write a Review'}</h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="rating">Rating (1-5):</label>
              <select
                id="rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                required
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts about this movie..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
              >
                {createReviewMutation.isPending || updateReviewMutation.isPending 
                  ? 'Submitting...' 
                  : (editingReview ? 'Update Review' : 'Submit Review')}
              </button>
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reviewsLoading && <LoadingSpinner message="Loading reviews..." />}

        {reviews && reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <div className="review-meta">
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <p className="review-comment">{review.comment}</p>
                
                {(isAdmin || review.userId === userInfo?.userId) && (
                  <div className="review-actions">
                    {review.userId === userInfo?.userId && (
                      <button 
                        onClick={() => handleEditReview(review)}
                        className="btn-edit-review"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="btn-delete-review"
                      disabled={deleteReviewMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !reviewsLoading && (
            <p className="no-reviews">No reviews yet. Be the first to review this movie!</p>
          )
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
