import { UrlApp } from './url-app';

try {
  const port = process.env.PORT || '3000';
  new UrlApp().start(port);
} catch (e) {
  console.error(e);
  process.exit(1);
}

process.on('uncaughtException', (error: Error) => {
  console.error('uncaughtException', error);
  process.exit(1);
});
