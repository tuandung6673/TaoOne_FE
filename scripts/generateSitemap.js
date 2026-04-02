const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

(async () => {
  const hostname = "https://taoone.vn"; // Thay domain thật
  const smStream = new SitemapStream({ hostname });
  const writeStream = createWriteStream("./public/sitemap.xml");

  smStream.pipe(writeStream);

  // ✅ Route tĩnh
  const staticRoutes = ["/", "/watch", "/ipad", "/macbook", "/airpods", "/accessories", "/news"];
  staticRoutes.forEach((r) =>
    smStream.write({ url: r, changefreq: "weekly", priority: 0.8 })
  );

  // ✅ Route động - từ API
  const products = await fetch("https://taoone.vn/api/News/GetNewsList?filter=&offSet=0&pageSize=100&status=1").then((res) =>
    res.json()
  );
  products?.data?.data.forEach((p) =>
    smStream.write({ url: `/news/${p.slug}`, changefreq: "weekly", priority: 0.8 })
  );

  smStream.end();
  await streamToPromise(smStream);
})();
