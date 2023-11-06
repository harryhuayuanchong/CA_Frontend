import serviceAxios from '../index';

export const getUserInfo = (params) => {
  return serviceAxios({
    url: '/stablecoins',
    method: 'get',
    params,
  });
};
