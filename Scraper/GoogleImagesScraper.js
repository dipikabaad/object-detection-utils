const phantom = require('phantom');
 
(async function() {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });
 
  const status = await page.open('https://www.google.co.in/search?q=Yahoo+logo&source=lnms&tbm=isch&sa=X', function(status) {
    console.log("Inside");
    var elements = page.evaluate(function(){
        console.log("Contente is here:");
        console.log(document.getElementByClassName('qua').textContent);
        return document.getElementByClassName('qua').textContent;
    });
    console.log(elements);
  });
  console.log(status);
  const content = await page.property('content');
  const us = await page.evaluate(function() {
    console.log(document);

    return document.querySelectorAll('#rg_s');
  });
  console.log(us);

  //console.log(content);
  //console.log(typeof(content));


 
  await instance.exit();
})();


