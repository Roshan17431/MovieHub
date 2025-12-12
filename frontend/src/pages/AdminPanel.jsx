import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '../services/movieService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['movies', page, size],
    queryFn: () => movieService.getMovies({ page, size }),
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id) => movieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
    onError: (err) => {
      alert(typeof err === 'string' ? err : 'Failed to delete movie');
    },
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteMovieMutation.mutate(id);
    }
  };

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-header">
        <h1>Admin Panel - Movie Management</h1>
        <button 
          onClick={() => navigate('/admin/movies/new')}
          className="btn-create"
        >
          + Create New Movie
        </button>
      </div>

      {isLoading && <LoadingSpinner message="Loading movies..." />}
      
      {error && (
        <ErrorMessage 
          message={typeof error === 'string' ? error : 'Failed to load movies'} 
          onRetry={refetch}
        />
      )}

      {data && (
        <>
          <div className="movies-table-container">
            <table className="movies-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th>Release Date</th>
                  <th>Reviews</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content && data.content.length > 0 ? (
                  data.content.map((movie) => (
                    <tr key={movie.id}>
                      <td>{movie.id}</td>
                      <td className="movie-title-cell">
                        <a href={`/movies/${movie.id}`} target="_blank" rel="noopener noreferrer">
                          {movie.title}
                        </a>
                      </td>
                      <td>{movie.genre}</td>
                      <td>⭐ {movie.rating}/10</td>
                      <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                      <td>
                        {movie.averageReviewRating !== null && movie.averageReviewRating !== undefined
                          ? `${movie.averageReviewRating.toFixed(1)}/5 (${movie.reviewCount || 0})`
                          : 'No reviews'}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => navigate(`/admin/movies/${movie.id}`)}
                          className="btn-edit-small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id, movie.title)}
                          className="btn-delete-small"
                          disabled={deleteMovieMutation.isPending}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No movies found. Create your first movie!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default AdminPanel;
