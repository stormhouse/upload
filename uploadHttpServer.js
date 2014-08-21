var http = require("http")
var fs = require('fs')
var qs = require('querystring')
var formidable = require('formidable')
var util = require('util');

var allFiles = {
  code: {
    path: '',
    finished: false,
    start: 0
  }
}
fs.readdir('files', function(err, files){
  for(var i= 0,len=files.length; i<len; i++){
    var file = files[i]

  }
})
http.createServer(function(request, response) {
  if(request.url == '/upload.html'){
    fs.readFile('upload.html','utf-8', function(err,data){
      response.writeHead(200, {"Content-Type": "text/html"})
      response.write(data);
      response.end();
    })
  }
  if(request.url.indexOf('.js')>-1){
    fs.readFile(request.url.slice(1, request.url.length),'utf-8', function(err,data){
      response.writeHead(200, {"Content-Type": "text/javascript"})
      response.write(data);
      response.end();
    })
  }
  if(request.url.indexOf('checkFile')>-1){
    var post = '' //qs.parse(request.url)
    request.on('data', function(chunk){
      post += chunk
    })
    request.on('end', function(){
      console.log(allFiles)
      post = qs.parse(post)
      response.writeHead(200, {"Content-Type": "text/json"})
      if(allFiles[post.code]){
        response.write(JSON.stringify({exits: true, start: allFiles[post.code].start}));
      }else{
        response.write(JSON.stringify({exits: false, start: 0}));
      }
      response.end();
    })
  }
  if(request.url == '/uploadFinished'){
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
      if(allFiles[fields.md5]){
        allFiles[fields.md5].finished = true
        allFiles[fields.md5].start = '-1'
      }
      response.writeHead(200, {'content-type': 'text/json'});
      response.write('{"success": true}');
      response.end()
    })
  }
  if(request.url == '/upload'){
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
//      response.writeHead(200, {'content-type': 'text/json'});
//      response.write('received upload:\n\n');
//      response.end(util.inspect({fields: fields, files: files}));
      var file = files.file
      var tempPath = file.path
      var fileName = decodeURIComponent(fields.name)
      fs.readFile(tempPath, "", function(err, content){
        if(fields.start == 0){
          fs.writeFile('./files/'+fileName, content, '', function(err){
            console.log(content.length)
            if(err){
              console.log(err)
            }else{
              console.log('000'+fields.start)
              var ff
              if(!allFiles[fields.md5]){
                allFiles[fields.md5] = {}
              }
              ff = allFiles[fields.md5]
              ff.path = './files/'+fileName
              ff.start = fields.start
              response.writeHead(200, {'content-type': 'text/json'});
              response.write(JSON.stringify(fields));
              response.end(util.inspect({fields: fields, files: files}));
            }
          });

        }else{
          fs.appendFile('./files/'+fileName,content,'',function(err){
            console.log(content.length)
            if(err){
              console.log(err);
            }
            var ff
            if(!allFiles[fields.md5]){
              allFiles[fields.md5] = {}
            }
            ff = allFiles[fields.md5]
            ff.path = './files/'+fileName
            ff.start = fields.start
            response.writeHead(200, {'content-type': 'text/json'});
            response.write(JSON.stringify(fields));
            response.end(util.inspect({fields: fields, files: files}));
          });
        }
      })
    });

  }
  if(request.url == '/upload'){

  }
//  response.writeHead(200, {"Content-Type": "text/plain"});
//  response.write("Hello World");
//  response.end();
}).listen(8888);