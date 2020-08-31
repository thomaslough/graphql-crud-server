const axios = require('axios');

axios.interceptors.response.use(function (response) {
  return response.data;
});

export const request = (query, token = null) => {
  const params = {
    url: 'http://localhost:4000/api/',
    method: 'post',
    data: { query },
  };

  if (token) {
    params.headers = { Authorization: `Bearer ${token}` };
  }

  const ax = axios(params);

  return ax;
};
