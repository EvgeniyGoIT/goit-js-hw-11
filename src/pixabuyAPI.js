import axios from 'axios';

export default async function fetchData(searchQuery, page = 1) {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = '36854264-eb4d11c0d5687864ceed52463';
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error('An error occurred while fetching images.');
  }
}


