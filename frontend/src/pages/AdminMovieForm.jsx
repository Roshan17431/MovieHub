import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '../services/movieService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './AdminMovieForm.css';

function AdminMovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [description, setDescription] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [error, setError] = useState('');

  // Fetch movie data if editing
  const { isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      setTitle(data.title);
      setGenre(data.genre);
      setRating(data.rating);
      setReleaseDate(data.releaseDate);
      setPosterUrl(data.posterUrl || '');
      setDescription(data.description || '');
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (movieData) => {
      if (isEditMode) {
        return movieService.updateMovie(id, movieData);
      } else {
        return movieService.createMovie(movieData);
      }
    },
    onSuccess: async (savedMovie) => {
      // Upload poster if file is selected
      if (posterFile) {
        try {
          await movieService.uploadPoster(savedMovie.id, posterFile);
        } catch (err) {
          console.error('Failed to upload poster:', err);
        }
      }
      
      queryClient.invalidateQueries(['movies']);
      queryClient.invalidateQueries(['movie', savedMovie.id]);
      navigate('/admin');
    },
    onError: (err) => {
      setError(typeof err === 'string' ? err : 'Failed to save movie');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title || !genre || !rating || !releaseDate) {
      setError('Please fill in all required fields');
      return;
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      setError('Rating must be between 0 and 10');
      return;
    }

    const movieData = {
      title,
      genre,
      rating: ratingNum,
      releaseDate,
      posterUrl: posterUrl || undefined,
      description: description || undefined,
    };

    saveMutation.mutate(movieData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setPosterFile(file);
      setError('');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading movie..." />;

  return (
    <div className="admin-form-page">
      <div className="admin-form-container">
        <div className="admin-form-header">
          <h1>{isEditMode ? 'Edit Movie' : 'Create New Movie'}</h1>
          <button onClick={() => navigate('/admin')} className="btn-back">
            ← Back to Admin Panel
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter movie title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              placeholder="e.g., Action, Drama, Comedy"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (0-10) *</label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              min="0"
              max="10"
              step="0.1"
              placeholder="Enter rating"
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Release Date *</label>
            <input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="posterUrl">Poster URL (optional)</label>
            <input
              type="url"
              id="posterUrl"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="Enter poster image URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="posterFile">Or Upload Poster Image</label>
            <input
              type="file"
              id="posterFile"
              accept="image/*"
              onChange={handleFileChange}
            />
            {posterFile && (
              <p className="file-info">Selected: {posterFile.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Enter movie description"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending 
                ? 'Saving...' 
                : (isEditMode ? 'Update Movie' : 'Create Movie')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin')}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminMovieForm;
