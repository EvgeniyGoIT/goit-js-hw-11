import axios from 'axios';

const fetchData = async (currentQuery, currentPage) => {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = '36854264-eb4d11c0d5687864ceed52463';
  const params = new URLSearchParams({
    key: API_KEY,
    q: currentQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error('An error occurred while fetching images.');
  }
};

export default fetchData;