import request from '@/utils/request';

export function getCS() {
  return request({
    method: 'get',
    url: '/login/qr/key',
  });
}