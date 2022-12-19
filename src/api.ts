const API_KEY = "34794ce3f355f2a8168e538558fc7106";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IVideo {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
  media_type: string;
}

interface IMovieGenres {
  id: number;
  name: string;
}
export interface IMovieDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  overview: string;
  media_type: string;
  runtime?: number;
  genres: IMovieGenres[];
  popularity: number;
  release_date?: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvDetail extends IMovieDetail {
  name: string;
  seasons: {
    air_date: string;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
}

export interface IGetVideosResult {
  page: number;
  results: IVideo[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IVideo[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvsResult {
  page: number;
  results: IVideo[];
  total_pages: number;
  total_results: number;
}

export interface ISearchResult {
  page: number;
  results: IVideo[];
}

export function getMoviesLatest() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getMoviesTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getMoviesUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getMovie(id: number) {
  return fetch(
    `${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getTvsLatestShows() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getTvsArirangToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getTvsPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getTvsTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function getTv(id: number) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko-KR`).then(
    (response) => response.json()
  );
}

export function searchAll(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}`
  ).then((response) => response.json());
}
