import popsicle from 'popsicle';

const catchFn = (error, url, method) => {
  console.error(`Error: ${error}. Method: ${method}. Url: ${url}`);
}

export default {
  get(url, query) {
    return popsicle({method: 'GET', url, query})
      .then((response) => JSON.parse(response.body))
      .catch((error) => { catchFn(error, url, 'GET') });
  },

  post(url, body) {
    return popsicle({method: 'POST', url, body})
      .then((response) => JSON.parse(response.body))
      .catch((error) => { catchFn(error, url, 'GET') });
  },

  remove(url, body) {
    return popsicle({method: 'POST', url, body})
      .catch((error) => { catchFn(error, url, 'DELETE') });
  }
}
