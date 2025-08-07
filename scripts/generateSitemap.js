const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/watch", changefreq: "monthly", priority: 0.8 },
    { url: "/ipad", changefreq: "monthly", priority: 0.8 },
    { url: "/macbook", changefreq: "monthly", priority: 0.8 },
    { url: "/airpods", changefreq: "monthly", priority: 0.8 },
    { url: "/news", changefreq: "monthly", priority: 0.8 },
];

const sitemapStream = new SitemapStream({ hostname: "https://taoone.vn" });

// ✅ Phải ghi từng link vào stream
links.forEach((link) => sitemapStream.write(link));

sitemapStream.end();

streamToPromise(sitemapStream)
    .then((data) => {
        fs.writeFileSync("public/sitemap.xml", data.toString());
        console.log("✅ Sitemap generated!");
    })
    .catch((err) => console.error("❌ Error generating sitemap", err));
