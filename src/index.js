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

    standardMsg = await channel.send(standardEmbed);
    ILSImsg = await channel.send(ILSIEmbed);

    while (1) {
      try {
        [standardEmbed, ILSIEmbed] = await getMsg();
      } catch (e) {
        console.log(`Err: ${e}`);
      }

      standardMsg.edit(standardEmbed);
      ILSImsg.edit(ILSIEmbed);

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
    components: [
      {
        type: 1,
        components: [
          {
            style: 5,
            label: `Coingecko`,
            url: `https://www.coingecko.com/en/coins/stakeborg-dao`,
            disabled: false,
            type: 2
          }
        ]
      }
    ],
    embeds: [
      {
        type: "rich",
        title: `STANDARD`,
        url: "https://www.coingecko.com/en/coins/stakeborg-dao",
        thumbnail: {
          url: `https://s2.coinmarketcap.com/static/img/coins/64x64/14210.png`,
          height: 50,
          width: 50
        },
        description: `**Price**\n\`${new Intl.NumberFormat().format(
          standard_price
        )}$\` \u3000 \`${standard_price_change.toFixed(
          2
        )}%\` in last 24h \n**Market Cap**\n\`${new Intl.NumberFormat().format(
          standard_marketcap
        )}$\` \u3000 \`${standard_marketcap_change.toFixed(
          2
        )}%\` in last 24h \n**Circulating supply**\n\`${new Intl.NumberFormat().format(
          standard_supply.toFixed(0)
        )}\` (\`${((standard_supply / 20000000) * 100).toFixed(
          2
        )}%\` of total)`,
        color: 0x0095ff,
        timestamp: new Date(),
        footer: {
          text: `One for all and all for DAO ❤️`,
          icon_url: `https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705`
        }
      }
    ]
  };

  const ILSIEmbed = {
    components: [
      {
        type: 1,
        components: [
          {
            style: 5,
            label: `Coingecko`,
            url: `https://www.coingecko.com/en/coins/invest-like-stakeborg-index`,
            disabled: false,
            type: 2
          }
        ]
      }
    ],
    embeds: [
      {
        type: "rich",
        title: `ILSI`,
        url: "https://www.coingecko.com/en/coins/invest-like-stakeborg-index",
        thumbnail: {
          url: `https://s2.coinmarketcap.com/static/img/coins/64x64/16292.png`,
          height: 50,
          width: 50
        },
        description: `**Price**\n\`${new Intl.NumberFormat().format(
          ilsi_price
        )}$\` \u3000 \`${ilsi_price_change.toFixed(
          2
        )}%\` in last 24h \n**Market Cap**\n\`${new Intl.NumberFormat().format(
          ilsi_marketcap
        )}$\` \u3000 \`${ilsi_marketcap_change.toFixed(
          2
        )}%\` in last 24h \n**Circulating supply**\n\`${new Intl.NumberFormat().format(
          ilsi_supply.toFixed(0)
        )}\``,
        color: 0x0095ff,
        timestamp: new Date(),
        footer: {
          text: `One for all and all for DAO ❤️`,
          icon_url: `https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705`
        }
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
