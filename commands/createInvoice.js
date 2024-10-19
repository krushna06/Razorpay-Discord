const { SlashCommandBuilder } = require('discord.js');
const { createInvoice } = require('../utils/razorpay');

module.exports = {
  data: new SlashCommandBuilder()
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

  async execute(interaction) {
    const customerEmail = interaction.options.getString('email');
    const customerContact = interaction.options.getString('contact');
    const itemName = interaction.options.getString('item');
    const itemAmount = interaction.options.getNumber('amount');

    const invoice = await createInvoice(customerEmail, customerContact, itemName, itemAmount);

    if (invoice) {
      await interaction.reply(`Invoice created! View it here: ${invoice.short_url}`);
    } else {
      await interaction.reply('Failed to create the invoice.');
    }
  }
};
