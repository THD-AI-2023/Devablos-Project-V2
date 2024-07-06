const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 }
];

const generateSitemap = async () => {
  const stream = new SitemapStream({ hostname: 'https://devablos-v2.azurewebsites.net' });

  const data = await streamToPromise(Readable.from(links).pipe(stream));
  fs.writeFileSync('public/sitemap.xml', data.toString());

  console.log('Sitemap generated successfully.');
};

generateSitemap().catch(console.error);
