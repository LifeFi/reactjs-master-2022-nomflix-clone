const API_KEY = "34794ce3f355f2a8168e538558fc7106";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  media_type: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvsResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface ISearchResult {
  page: number;
  results: IMovie[];
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

export function getTvs() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&region=KR&language=ko-KR`
  ).then((response) => response.json());
}

export function searchAll(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}`
  ).then((response) => response.json());
}

export async function getMovie(id: number) {
  return fetch(
    `${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
