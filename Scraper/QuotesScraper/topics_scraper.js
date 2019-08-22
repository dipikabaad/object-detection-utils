const puppeteer = require('puppeteer');
const download = require('image-downloader');
const lineReader = require('line-reader');
const fs = require('fs')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // sleep before making multiple calls to google images
  await sleep(5000);
  await page.goto('https://www.brainyquote.com/topics');

  const textContent = await page.evaluate(() => {

    // in chrome
    var items = document.querySelectorAll('.topicContentName');
    var entries = [];
    for(var i = 0; i < items.length; i++) {
      entries.push(items[i].innerText);
    }
    return entries;
    // in chrome

  });
  //console.log(textContent);
  var data = ""
  for(var i=0; i < textContent.length; i++) {
    data = textContent[i] + "\n"
    fs.appendFile('./output_data/topics_brainyquotes.txt', data, function(err){
      if (err) return console.log(err);
      console.log('Appended!');
    })
  }
  browser.close();
})();