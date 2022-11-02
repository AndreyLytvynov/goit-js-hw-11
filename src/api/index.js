import axios from 'axios';

export async function getAllPages(nameImg, page = '1') {
  const getRequest = axios.create({
    baseURL: 'https://pixabay.com/api/',
    headers: { 'Content-Type': 'application/json' },
    params: {
      key: '30999598-dc54c9ae8f4c38c0174094b65',
      image_type: 'photo',
      per_page: 20,
      orientation: 'horizontal',
      safesearch: 'true',
      q: nameImg,
      page,
    },
  });

  const response = await getRequest.get();
  console.log(response);
  return response.data;
}
