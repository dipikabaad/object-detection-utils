const puppeteer = require('puppeteer');
const download = require('image-downloader');
const lineReader = require('line-reader');
const lineByLine = require('n-readlines');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let queries = []
  const liner = new lineByLine('topics.txt');
  while (line = liner.next()) {
    queries.push(line);
  }
  console.log(queries)
  //var queries = ["work+in+cafe", "friendship", "love"]
  imagesDownloaded = {}
  for (var q=0; q < queries.length; q++) {
    // Google image search for a query
    query = queries[q]
    // sleep before making multiple calls to google images
    await sleep(5000);
    await page.goto('https://www.google.co.in/search?q=' + query + '&source=lnms&tbm=isch&sa=X');

    const textContent = await page.evaluate(() => {

      // in chrome
      var items = document.querySelectorAll('.rg_meta');
      var entries = [];
      for(var i = 0; i < items.length; i++) {
        entries.push({"link": JSON.parse(items[i].innerHTML)['ou'], "type": JSON.parse(items[i].innerHTML)['ity']});
      }
      return entries;
      // in chrome

    });
   
   // Saving all the images to a folder 
  // Download to a directory and save with the original filename
  var mkdirp = require('mkdirp');
  mkdirp('./images/'+ query, function(err) { 
      console.log("Successfully created folder")
      // path exists unless there was an error
  });
  // Go throuh each link
  imagesDownloaded[query] = 0;
  for (var i =0; i < textContent.length; i++) {
    if (textContent[i]['type'] === "png" || textContent[i]['type'] === "jpg" || textContent[i]['type'] === "gif" || textContent[i]['type'] === "jpeg") {
      const options = {
        //url: 'https://www.uctoday.com/wp-content/uploads/2019/05/RIPYahooTogether.jpg',
        url: textContent[i]['link'] ,
        dest: './images/' + query + '/'             // Save to /path/to/dest/image.jpg
      }
       
      download.image(options)
        .then(({ filename, image }) => {
          //console.log('File saved to', filename)
          imagesDownloaded[query] = imagesDownloaded[query] + 1
        })
        .catch((err) => {
          console.error(err)
        })
      }
    }
    console.log("Donwloaded images for")
    console.log(query + ":")
    console.log(imagesDownloaded) 
  }

  browser.close();
})();

//scraper python: https://gist.github.com/genekogan/ebd77196e4bf0705db51f86431099e57
//scraper javascript: http://flovv.github.io/scrape_images_google/

