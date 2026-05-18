import axios from "axios";

// Konfigurasi TMDB API
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNTgzZjkzMjU2NzQyOGY0ZDBiYzk3ZDU5NTRkMDllYSIsIm5iZiI6MTczNDIzNjE0MC4yNzUsInN1YiI6IjY3NWU1N2VjZjc0YzNhMTM4OGI5ZmU3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wZGnlSZpP8qyLD9RWWkvVAcq2o3AhKTP0yAwz04EKZE"; // Ganti dengan token Anda

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Fungsi untuk mengambil film trending
export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get("/trending/movie/week");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Fungsi untuk mengambil film popular
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return { results: [], total_pages: 0 };
  }
};

// Fungsi untuk mencari film
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 0 };
  }
};

// Fungsi untuk mendapatkan detail film
export const getMovieDetail = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    return null;
  }
};

export default tmdbApi;
