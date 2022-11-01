import axios from 'axios';

const getRequest = axios.create({
  baseURL: 'https://pixabay.com/api/',
  headers: { 'Content-Type': 'application/json' },
  params: {
    key: '30999598-dc54c9ae8f4c38c0174094b65',
    image_type: 'photo',
    per_page: 200,
    orientation: 'horizontal',
    safesearch: 'true',
  },
});

export async function getAllCountries(nameImg, page = '1') {
  const response = await getRequest.get(`?q=${nameImg}&page=${page}`);
  return response.data;
}
