module.exports = function (eleventyConfig) {
  // kopiuj zasoby 1:1 do outputu (Eleventy ich nie przetwarza)
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");

  return {
    dir: {
      input: "src",          // stąd czyta
      includes: "_includes", // czyli src/_includes
      output: "_site",       // tu wypluwa gotową stronę
    },
  };
};