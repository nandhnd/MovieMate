import axios from "axios";

// Ganti dengan endpoint MockAPI Anda
const WATCHLIST_API_URL =
  "https://6a0a08e321e445625695c28f.mockapi.io/watchlist";

const watchlistApi = axios.create({
  baseURL: WATCHLIST_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET semua film di watchlist
export const getWatchlist = async () => {
  try {
    const response = await watchlistApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};

// POST tambah film ke watchlist
export const addToWatchlist = async (movieData) => {
  try {
    const response = await watchlistApi.post("/", {
      ...movieData,
      addedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return null;
  }
};

// DELETE hapus film dari watchlist
export const removeFromWatchlist = async (id) => {
  try {
    await watchlistApi.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return false;
  }
};

// GET cek apakah film sudah di watchlist
export const isInWatchlist = async (movieId, watchlist) => {
  return watchlist.some((item) => item.movieId === movieId);
};

export default watchlistApi;
