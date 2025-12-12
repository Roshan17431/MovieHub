import api from './api';

export const movieService = {
  // Get movies with filters and pagination
  getMovies: async (params = {}) => {
    try {
      const response = await api.get('/movies', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch movies';
    }
  },

  // Get movie by ID
  getMovieById: async (id) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch movie';
    }
  },

  // Create new movie (Admin only)
  createMovie: async (movieData) => {
    try {
      const response = await api.post('/movies', movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create movie';
    }
  },

  // Update movie (Admin only)
  updateMovie: async (id, movieData) => {
    try {
      const response = await api.put(`/movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update movie';
    }
  },

  // Delete movie (Admin only)
  deleteMovie: async (id) => {
    try {
      await api.delete(`/movies/${id}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete movie';
    }
  },

  // Upload movie poster (Admin only)
  uploadPoster: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/movies/${id}/poster`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload poster';
    }
  },
};
