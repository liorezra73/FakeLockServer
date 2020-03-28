const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });
const indexs = async () => {
  const x = await client.index({
    index: "game-of-thrones",
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      character: "Daenerys Targaryen",
      quote: "I am the blood of the dragon."
    }
  });
  console.log(x)
};

module.exports = indexs;
