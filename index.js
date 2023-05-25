const fs = require("fs");
require("dotenv").config();

async function getData() {
  API_KEY = process.env.API_KEY;

  try {
    const json = await fetch(
      "https://hodlhodl.com/api/v1/contracts/my?filters[status]=completed",
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    ).then((res) => res.json());

    const priceAndVolume = json.contracts.map((c) => ({
      fiatPrice: parseFloat(c["price"]) * parseFloat(c["volume"]),
      volume: parseFloat(c["volume"]),
    }));

    const totalFiatSpent = priceAndVolume.reduce(
      (total, item) => total + item["fiatPrice"],
      0
    );
    const totalVolume = priceAndVolume.reduce(
      (total, item) => total + item["volume"],
      0
    );

    const result = {
      totalFiatSpent: totalFiatSpent,
      totalVolume: totalVolume,
      avgPrice: totalFiatSpent / totalVolume,
    };

    console.log(result);

    fs.writeFile("out/summary.json", JSON.stringify(result, null, 4), (err) => {
      if (err) throw err;
      console.log("Summary written to summary.json");
    });

    fs.writeFile("out/all.json", JSON.stringify(json, null, 4), (err) => {
      if (err) throw err;
      console.log("All data written to all.json");
    });
  } catch (error) {
    throw error;
  }
}
getData();
