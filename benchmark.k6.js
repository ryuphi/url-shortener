import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    my_api_test_1: {
      executor: 'constant-arrival-rate',
      rate: 5000,
      timeUnit: '1m', // 5000 iterations per minute, i.e. 83.34 RPS
      duration: '1m',
      preAllocatedVUs: 10, // the size of the VU (i.e. worker) pool for this scenario
      tags: { test_type: 'api' }, // different extra metric tags for this scenario
      exec: 'createUrl' // this scenario is executing different code than the one above!
    }
  }
};

export function createUrl() {
  const url = 'http://localhost:5001';
  const payload = JSON.stringify({
    url: 'https://www.google.com/search?q=kittyies'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const res = http.post(url, payload, params);
  check(res, { 'status was 201': r => r.status === 201 });
}
