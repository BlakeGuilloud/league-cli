#!/usr/bin/env node

const commander = require('commander');
const http      = require('http');

commander.version('0.1.5');
commander.command('random')
  .description('get a random champion')
  .action(() => {
    getChampions(true);
  });

commander.command('get')
  .description('return all of the champions')
  .action(() => {
    getChampions();
  });

commander.parse(process.argv);

function getChampions(random) {
  return http.get('http://ddragon.leagueoflegends.com/cdn/6.22.1/data/en_US/champion.json', (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        const champData = Object.keys(parsedData.data);
        if (random) {
          const randomInt = getRandomInt(0, champData.length);
          const randomChamp = champData[randomInt];
          console.log(randomChamp);
        } else {
          console.log(champData.join(', '));
        }
      } catch (e) {
        console.log(e.message);
      }
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
