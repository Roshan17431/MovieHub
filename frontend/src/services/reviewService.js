import api from './api';

export const reviewService = {
  // Get reviews for a movie
  getReviews: async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },

  // Create review (Authenticated users)
  createReview: async (movieId, reviewData) => {
    try {
      const response = await api.post(`/movies/${movieId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create review';
    }
  },

  // Update review (Owner only)
  updateReview: async (movieId, reviewId, reviewData) => {
    try {
      const response = await api.put(`/movies/${movieId}/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update review';
    }
  },

  // Delete review (Owner or Admin)
  deleteReview: async (movieId, reviewId) => {
    try {
      await api.delete(`/movies/${movieId}/reviews/${reviewId}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete review';
    }
  },
};
