import { UrlApp } from './url-app';

try {
  new UrlApp().start();
} catch (e) {
  console.error(e);
  process.exit(1);
}

process.on('uncaughtException', (error: Error) => {
  console.error('uncaughtException', error);
  process.exit(1);
});
