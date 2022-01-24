const { Client, Intents, MessageEmbed } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

let standardMsg, ILSImsg;

async function main() {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  console.log("Log in");
  client.login(process.env.TOKEN);

  client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channel = client.channels.cache.get("934866573137678436");

    [standardEmbed, ILSIEmbed] = await getMsg();

    standardMsg = await channel.send({ embeds: [standardEmbed] });
    ILSImsg = await channel.send({ embeds: [ILSIEmbed] });

    while (1) {
      [standardEmbed, ILSIEmbed] = await getMsg();

      standardMsg.edit({ embeds: [standardEmbed] });
      ILSImsg.edit({ embeds: [ILSIEmbed] });

      await sleep(60 * 1000);
    }
  });
}

const getMsg = async () => {
  [
    standard_price,
    standard_price_change,
    standard_marketcap,
    standard_marketcap_change,
    standard_supply,
    ilsi_price,
    ilsi_price_change,
    ilsi_marketcap,
    ilsi_marketcap_change,
    ilsi_supply
  ] = await getData();

  const standardEmbed = {
    type: "rich",
    title: `STANDARD`,
    url: "https://www.coingecko.com/en/coins/stakeborg-dao",
    thumbnail: {
      url: `https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705`,
      height: 50,
      width: 50
    },
    description: "",
    color: 0x0095ff,
    fields: [
      {
        name: "Price",
        value: `**${new Intl.NumberFormat().format(standard_price)}$**`,
        inline: true
      },
      {
        name: "\u200B",
        value: `**${standard_price_change.toFixed(2)}%** in last 24h`,
        inline: true
      },
      {
        name: `\u200B`,
        value: "\u200B",
        inline: true
      },
      {
        name: `Market Cap`,
        value: `**${new Intl.NumberFormat().format(standard_marketcap)}$**`,
        inline: true
      },
      {
        name: "\u200B",
        value: `**${standard_marketcap_change.toFixed(2)}%** in last 24h`,
        inline: true
      },
      {
        name: `\u200B`,
        value: "\u200B",
        inline: true
      },
      {
        name: `Circulating supply`,
        value: `${new Intl.NumberFormat().format(
          standard_supply.toFixed(0)
        )} (${((standard_supply / 20000000) * 100).toFixed(2)}% of total)`
      }
    ]
  };

  const ILSIEmbed = {
    type: "rich",
    title: `ILSI`,
    url: "https://www.coingecko.com/en/coins/invest-like-stakeborg-index",
    thumbnail: {
      url: `https://assets.coingecko.com/coins/images/21788/small/16292.png?1640048590`,
      height: 50,
      width: 50
    },
    description: "",
    color: 0x0095ff,
    fields: [
      {
        name: `Price`,
        value: `**${new Intl.NumberFormat().format(ilsi_price)}$**`,
        inline: true
      },
      {
        name: "\u200B",
        value: `**${ilsi_price_change.toFixed(2)}%** in last 24h`,
        inline: true
      },
      {
        name: `\u200B`,
        value: "\u200B",
        inline: true
      },
      {
        name: `Market Cap`,
        value: `**${new Intl.NumberFormat().format(ilsi_marketcap)}$**`,
        inline: true
      },
      {
        name: "\u200B",
        value: `**${ilsi_marketcap_change.toFixed(2)}%** in last 24h`,
        inline: true
      },
      {
        name: `\u200B`,
        value: "\u200B",
        inline: true
      },
      {
        name: `Circulating supply`,
        value: `${new Intl.NumberFormat().format(ilsi_supply.toFixed(0))}`
      }
    ]
  };
  return [standardEmbed, ILSIEmbed];
};

const getData = async () => {
  //STANDARD

  let response = await get(
    "https://api.coingecko.com/api/v3/coins/stakeborg-dao?market_data=true"
  );
  let standard_price = response["market_data"]["current_price"]["usd"];
  let standard_price_change =
    response["market_data"]["price_change_percentage_24h_in_currency"]["usd"];

  response = await get(
    "https://api.coingecko.com/api/v3/coins/stakeborg-dao?market_data=true"
  );

  let standard_marketcap = response["market_data"]["market_cap"]["usd"];
  let standard_marketcap_change =
    response["market_data"]["market_cap_change_percentage_24h_in_currency"][
      "usd"
    ];

  response = await get(
    "https://api.coingecko.com/api/v3/coins/stakeborg-dao?market_data=true"
  );

  let standard_supply = response["market_data"]["circulating_supply"];

  //ILSI
  response = await get(
    "https://api.coingecko.com/api/v3/coins/invest-like-stakeborg-index?market_data=true"
  );
  let ilsi_price = response["market_data"]["current_price"]["usd"];
  let ilsi_price_change =
    response["market_data"]["price_change_percentage_24h_in_currency"]["usd"];

  response = await get(
    "https://api.coingecko.com/api/v3/coins/invest-like-stakeborg-index?market_data=true"
  );

  let ilsi_marketcap = response["market_data"]["market_cap"]["usd"];
  let ilsi_marketcap_change =
    response["market_data"]["market_cap_change_percentage_24h_in_currency"][
      "usd"
    ];

  response = await get(
    "https://api.coingecko.com/api/v3/coins/invest-like-stakeborg-index?market_data=true"
  );

  let ilsi_supply = response["market_data"]["circulating_supply"];

  return [
    standard_price,
    standard_price_change,
    standard_marketcap,
    standard_marketcap_change,
    standard_supply,
    ilsi_price,
    ilsi_price_change,
    ilsi_marketcap,
    ilsi_marketcap_change,
    ilsi_supply
  ];
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get(url) {
  let json = await (await fetch(url)).json();
  return json;
}

main();
