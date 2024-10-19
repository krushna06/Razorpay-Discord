require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const razorpayAuth = {
  username: process.env.RAZORPAY_KEY_ID,
  password: process.env.RAZORPAY_KEY_SECRET
};

async function createInvoice(customerEmail, customerContact, itemName, itemAmount) {
  const invoiceData = {
    type: "invoice",
    customer: {
      email: customerEmail,
      contact: customerContact
    },
    line_items: [
      {
        name: itemName,
        amount: itemAmount * 100,
        currency: "INR",
        quantity: 1
      }
    ]
  };

  try {
    const response = await axios.post('https://api.razorpay.com/v1/invoices', invoiceData, {
      auth: razorpayAuth
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error.response.data);
    return null;
  }
}

const commands = [
  new SlashCommandBuilder()
    .setName('createinvoice')
    .setDescription('Create a new Razorpay invoice')
    .addStringOption(option => 
      option.setName('email')
        .setDescription('Customer email')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('contact')
        .setDescription('Customer contact number')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('item')
        .setDescription('Item name')
        .setRequired(true))
    .addNumberOption(option => 
      option.setName('amount')
        .setDescription('Item amount')
        .setRequired(true)),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('1038037031982481548', '877062059966206002'),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'createinvoice') {
    const customerEmail = options.getString('email');
    const customerContact = options.getString('contact');
    const itemName = options.getString('item');
    const itemAmount = options.getNumber('amount');

    const invoice = await createInvoice(customerEmail, customerContact, itemName, itemAmount);

    if (invoice) {
      await interaction.reply(`Invoice created! View it here: ${invoice.short_url}`);
    } else {
      await interaction.reply('Failed to create the invoice.');
    }
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
