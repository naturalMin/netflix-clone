export const API_KEY = 'ebd4d063593bc5107bde0138eb846ff2';
export const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: string;
  title: string;
  overview: string;

}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number,
  results: IMovie[],
  total_pages: number,
  total_results: number,
}

export interface ITVShows {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTVShowsResult {
  results: ITVShows[], 

}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  .then(response => response.json());
}

export function getTVShows() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`)
  .then(response => response.json());
}

