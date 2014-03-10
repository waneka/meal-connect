var jsdom = require('jsdom');
var request = require('request');

exports.craigslist = function(req, res) {
  request({
    url: 'http://sfbay.craigslist.org/search/zip/sfc?zoomToPosting=&catAbb=zip&query=clothes&minAsk=&maxAsk=&excats='
  }, function(err, response, body) {
    if(err && response.statusCode !== 200){console.log('Request error.');}
    
    jsdom.env({
      html: body,
      scripts: ['http://code.jquery.com/jquery-2.0.3.min.js'],
      done: function(err, window) {
        var $ = window.jQuery;
        
        // Iterate over listings
        var listings = [];
        $('#toc_rows .row').each(function(i) {
          // Scrape all the listing information
          var listing = {
            lat: $(this).data('latitude') || 0,
            lon: $(this).data('longitude') || 0,
            id: $(this).data('pid'),
            date: $('span.date',$(this)).text() || "",
            title: $('.pl > a',$(this)).text() || "",
            // Neighborhood is wrapped in parentheses, so we need to remove them
            neighborhood: ($('.l2 .pnr small',$(this)).text()||"").replace(/^\s*\(|\)\s*$/g,'')
          };
          
          // Don't include posts without a neighborhood
          if(!listing.neighborhood) return;
          
          // TODO: better spam detection
          if(!listing.title.match(/free|clothes/i)) return;
          
          listings.push(listing);
        });
        
        res.render('craigslist',{
          listings: listings
        });
      }
    });
  });
}
