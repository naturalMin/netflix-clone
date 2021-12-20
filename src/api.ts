const API_KEY = 'ebd4d063593bc5107bde0138eb846ff2';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
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

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  .then(response => response.json());
}