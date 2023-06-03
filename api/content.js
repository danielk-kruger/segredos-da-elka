require("dotenv").config();
const contentful = require("contentful");

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: process.env.CONTENTFUL_SPACEID,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

exports.storeContent = async () => {
  return await client
    .getEntries({
      content_type: "cakeyCakeStoreWebsite",
    })
    .then(({ items }) => {
      return items.map(({ fields, sys }) => ({
        title: fields.title,
        price: fields.price,
        isAvailable: fields.isAvailable,
        category: fields.category,
        id: sys.id,
        image: fields.image.fields.file.url,
      }));
    });
};
