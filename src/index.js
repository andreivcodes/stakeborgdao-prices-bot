const { Client, Intents, MessageEmbed } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

let standardMsg, ILSImsg, DAOxmsg;

async function main() {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
    autoReconnect: true,
  });

  console.log("Log in");
  client.login(process.env.TOKEN);

  client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channel = await client.channels.cache.get("934866573137678436");

    [standardEmbed, ILSIEmbed, DAOXEmbed] = await getMsg();

    try {
      let oldStandardmsg = await channel.messages.fetch("980552567396384849");
      standardMsg = oldStandardmsg;
    } catch (e) {
      standardMsg = await channel.send(standardEmbed);
    }

    try {
      let oldILSImsg = await channel.messages.fetch("980552569204121660");
      ILSImsg = oldILSImsg;
    } catch (e) {
      ILSImsg = await channel.send(ILSIEmbed);
    }

    try {
      let oldDAOXmsg = await channel.messages.fetch("980552571762659338");
      DAOXmsg = oldDAOXmsg;
    } catch (e) {
      DAOXmsg = await channel.send(DAOXEmbed);
    }

    while (1) {
      try {
        [standardEmbed, ILSIEmbed, DAOXEmbed] = await getMsg();
      } catch (e) {
        console.log(`Err: ${e}`);
      }

      console.log("edit msg");

      standardMsg.edit(standardEmbed);
      ILSImsg.edit(ILSIEmbed);
      DAOXmsg.edit(DAOXEmbed);

      await sleep(5 * 60 * 1000);
    }
  });

  client.on("error", (error) => {
    console.log(error);
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
    ilsi_supply,
    daox_price,
    daox_price_change,
    daox_marketcap,
    daox_marketcap_change,
    daox_supply,
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
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: "rich",
        title: `STANDARD`,
        url: "https://www.coingecko.com/en/coins/stakeborg-dao",
        thumbnail: {
          url: `https://1985505961-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FJetgnLmkYIvLk8hHmyCV%2Fuploads%2FCb5KDTFg9Qx2AUkAZzE6%2F5-stakeborgdao-medium.png?alt=media&token=4726ed67-1fe3-4091-bce3-77200a915496`,
          height: 50,
          width: 50,
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
          icon_url: `https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705`,
        },
      },
    ],
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
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: "rich",
        title: `ILSI`,
        url: "https://www.coingecko.com/en/coins/invest-like-stakeborg-index",
        thumbnail: {
          url: `https://1985505961-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FJetgnLmkYIvLk8hHmyCV%2Fuploads%2FOJulvYt8FoQv5ENGauv8%2F2-ilsi-medium.png?alt=media&token=6ff20747-06c8-4672-9b8f-7572238ac94b`,
          height: 50,
          width: 50,
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
          icon_url: `https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705`,
        },
      },
    ],
  };

  const DAOXEmbed = {
    components: [
      {
        type: 1,
        components: [
          {
            style: 5,
            label: `Coingecko`,
            url: `https://www.coingecko.com/en/coins/the-daox-index`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: "rich",
        title: `DAOX`,
        url: "https://www.coingecko.com/en/coins/the-daox-index",
        thumbnail: {
          url: `https://1985505961-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FJetgnLmkYIvLk8hHmyCV%2Fuploads%2F39bzMOqx7oH1OAJqc1Ww%2F3-daox-large.png?alt=media&token=9a786c78-f09c-4551-b83f-16a7be897aec`,
          height: 50,
          width: 50,
        },
        description: `**Price**\n\`${new Intl.NumberFormat().format(
          daox_price
        )}$\` \u3000 \`${daox_price_change.toFixed(
          2
        )}%\` in last 24h \n**Market Cap**\n\`${new Intl.NumberFormat().format(
          daox_marketcap
        )}$\` \u3000 \`${daox_marketcap_change.toFixed(
          2
        )}%\` in last 24h \n**Circulating supply**\n\`${new Intl.NumberFormat().format(
          daox_supply.toFixed(0)
        )}\``,
        color: 0x0095ff,
        timestamp: new Date(),
        footer: {
          text: `One for all and all for DAO ❤️`,
          icon_url: `https://assets.coingecko.com/coins/images/25042/small/200px-DAOx.png?1649911875`,
        },
      },
    ],
  };
  return [standardEmbed, ILSIEmbed, DAOXEmbed];
};

const getData = async () => {
  //STANDARD

  let response = await get(
    "https://api.coingecko.com/api/v3/coins/stakeborg-dao?market_data=true"
  );
  let standard_price = response["market_data"]["current_price"]["usd"] ?? 0;
  let standard_price_change =
    response["market_data"]["price_change_percentage_24h_in_currency"]["usd"] ??
    0;

  response = await get(
    "https://api.coingecko.com/api/v3/coins/stakeborg-dao?market_data=true"
  );

  let standard_marketcap = response["market_data"]["market_cap"]["usd"] ?? 0;
  let standard_marketcap_change =
    response["market_data"]["market_cap_change_percentage_24h_in_currency"][
      "usd"
    ] ?? 0;

  response = await get(
    "https://api.coingecko.com/api/v3/coins/stakeborg-dao?market_data=true"
  );

  let standard_supply = response["market_data"]["circulating_supply"] ?? 0;

  //ILSI
  response = await get(
    "https://api.coingecko.com/api/v3/coins/invest-like-stakeborg-index?market_data=true"
  );
  let ilsi_price = response["market_data"]["current_price"]["usd"] ?? 0;
  let ilsi_price_change =
    response["market_data"]["price_change_percentage_24h_in_currency"]["usd"] ??
    0;

  response = await get(
    "https://api.coingecko.com/api/v3/coins/invest-like-stakeborg-index?market_data=true"
  );

  let ilsi_marketcap = response["market_data"]["market_cap"]["usd"] ?? 0;
  let ilsi_marketcap_change =
    response["market_data"]["market_cap_change_percentage_24h_in_currency"][
      "usd"
    ] ?? 0;

  response = await get(
    "https://api.coingecko.com/api/v3/coins/invest-like-stakeborg-index?market_data=true"
  );

  let ilsi_supply = response["market_data"]["circulating_supply"] ?? 0;

  //DAOX
  response = await get(
    "https://api.coingecko.com/api/v3/coins/the-daox-index?market_data=true"
  );
  let daox_price = response["market_data"]["current_price"]["usd"] ?? 0;
  let daox_price_change =
    response["market_data"]["price_change_percentage_24h_in_currency"]["usd"] ??
    0;

  response = await get(
    "https://api.coingecko.com/api/v3/coins/the-daox-index?market_data=true"
  );

  let daox_marketcap = response["market_data"]["market_cap"]["usd"] ?? 0;
  let daox_marketcap_change =
    response["market_data"]["market_cap_change_percentage_24h_in_currency"][
      "usd"
    ] ?? 0;

  response = await get(
    "https://api.coingecko.com/api/v3/coins/the-daox-index?market_data=true"
  );

  let daox_supply = response["market_data"]["circulating_supply"] ?? 0;

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
    ilsi_supply,
    daox_price,
    daox_price_change,
    daox_marketcap,
    daox_marketcap_change,
    daox_supply,
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
