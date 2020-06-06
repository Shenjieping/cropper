import axios from 'axios';

export default {
  baseAxios (options) {
    const {url, method, data, timeout, params, ...others} = options;
    return axios({
      url,
      method,
      ...others,
      data,
      timeout
    })
    .then(({ data }) => {
      return Promise.resolve(data);
    }).catch(err => {
      return Promise.reject(err);
    });
  },
  get (options) {
    const {url, params, ...others} = options;
    return axios({
      url,
      method: 'get',
      ...others,
      params,
      timeout: 5 * 1000
    })
    .then(({ data }) => {
      return Promise.resolve(data);
    }).catch(err => {
      return Promise.reject(err);
    });
  },
  post(options) {
    const { url, data, ...others } = options;
    return axios({
      url,
      method: 'post',
      ...others,
      data,
      timeout: 5 * 1000
    })
      .then(({ data }) => {
        return Promise.resolve(data);
      }).catch(err => {
        return Promise.reject(err);
      });
  }
}