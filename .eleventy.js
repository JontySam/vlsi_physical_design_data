module.exports = function (eleventyConfig) {
  // Preserve authored HTML exactly (Eleventy v3 rewrites internal URLs in HTML by default).
  // This site already has stable canonical/OG URLs and manually curated links.
  if (eleventyConfig.htmlTransformer) {
    eleventyConfig.htmlTransformer.remove("html", () => true);
  }

  eleventyConfig.addPassthroughCopy({ "vlsi_physical_design_web/assets": "assets" });
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/main.css");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/main.js");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/carousel.js");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/blue-theme.css");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/search-data.json");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/sitemap.xml");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/robots.txt");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/BingSiteAuth.xml");
  eleventyConfig.addPassthroughCopy("vlsi_physical_design_web/_redirects");

  eleventyConfig.setServerOptions({
    port: 8080,
    showVersion: true
  });

  return {
    dir: {
      input: "vlsi_physical_design_web",
      includes: "_includes",
      data: "_data",
      output: "dist"
    },
    templateFormats: ["html"],
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
    passthroughFileCopy: true
  };
};
