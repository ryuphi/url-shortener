import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// with this options you'll generate 100 new links and 10100 lookup...
export const options = {
  discardResponseBodies: false,
  scenarios: {
    my_api_test_1: {
      executor: 'constant-arrival-rate',
      rate: 100,
      duration: '1m',
      timeUnit: '1m',
      preAllocatedVUs: 50,
      tags: { test_type: 'api' }
    }
  }
};

const lookupCounter = new Counter('lookup requests');
const createCounter = new Counter('create requests');

export default function () {
  const url = __ENV.BASE_URL || 'http://localhost:3000';
  const payload = JSON.stringify({
    url: 'https://www.google.com/search?q=kittyies'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const createResponse = http.post(url, payload, params);
  const { shortUrl } = createResponse.json();

  check(createResponse, {
    'status is 201': r => r.status === 201,
    'create < 200ms': () => createResponse.timings.duration
  });

  for (let i = 0; i < 100; i++) {
    const lookupResponse = http.get(shortUrl, { follow: false, redirects: 0 });
    check(lookupResponse, {
      'status is 302': r => r.status === 302,
      'duration lookup < 10ms': () => lookupResponse.timings.duration
    });
    lookupCounter.add(1);
  }

  createCounter.add(1);
  sleep(1);
}
