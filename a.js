
 var fs, path
fs = require('fs');
path = require('path');

var readline = require('readline');

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

function startTime() {
  startTime11 = window.performance.now();
}

function totalTime() {
  endTime11 = window.performance.now();
  return endTime11 - startTime11
}

function getDir(opts) {
  var count, countFolders, countFiles, FilesAllowed, countMatched, totalSize
  i = 0
  var results, pending, wantFiles, wantFolders, checkPending

  var searchDir = {
    setVars: function() {
      startTime()
      results = {
        dirInfo: [],
        directories: [],
        files: []
      };
      pending = 0
      wantFiles = true
      wantFolders = false

      count = 0
      countFolders = 0
      countFiles = 0
      FilesAllowed = 0
      countMatched = 0
      totalSize = 0
      eret = false

    },

    setDefaults: function(opts) {
      if (opts.type === "FileContents" || opts.type === "FileName") {
        if (!opts.search) {
          alert('search empty')
          return;
        }
        // searchDir.FileContents(x, opts)
      }

      if (opts.type === "Directory") {
        wantFolders = true
        wantFiles = true
        opts.depth = false
      }

      if (opts.show === "All") {
        wantFolders = true
        wantFiles = true
      }

      else if (opts.show === "Files") {
        wantFiles = true
        wantFolders = false
      }

      else if (opts.show === "Folders") {
        wantFolders = true
        wantFiles = false
      }

    },

    init: function(opts) {

      searchDir.setVars()

      searchDir.setDefaults(opts)

      pending++

      if (typeof opts.dir === "string") searchDir.readdir(opts)

      else opts.dir.forEach(function(v) {
        opts.dir1 = v
        opts.dir = v
        searchDir.readdir(opts)
      });
    },

    readdir: function(opts, dept) {
      if (!dept) dept = 0

      dept = dept + 1

      var currentPath = opts.dir

      console.log(dept + "======" + currentPath)

      fs.readdir(currentPath, function(err, files) {
        if (err) return opts.cb(err);

        pending--

        pending = pending + files.length;

        if (!pending) return opts.cb();

        files.forEach(function(v) {
          count++

          var currentFile = currentPath + '/' + v;

          if (searchDir.ignorer(v, opts)) {
            if (opts.type !== "Directory") {
              searchDir.checkPending(opts.cb);
              return;
            }
          }

          searchDir.stat3(v, opts, currentFile, dept)
        });

      });

    },

    stat3: function(v, opts, currentFile, dept) {
      fs.stat(currentFile, function(err, stat) {
        var x = {
          ext: 'folder',
          file: currentFile,
          stat: stat
        }

        if (stat && stat.isDirectory()) searchDir.isDirectory(x, opts, dept)

        else if (stat && stat.isFile()) {

          if (wantFiles) searchDir.isFile.isFile(x, opts)

          else searchDir.checkPending(opts.cb);
        }

        else searchDir.checkPending(opts.cb);

      });
    },

    isDirectory: function(x, opts, dept) {
      countFolders++

      if (wantFolders) searchDir.pushOut(x, opts, "folders")

      if (opts.depth === "true") {

        if (dept < 28) {

          opts.dir = x.file
          pending++

          //  console.log(x.file + dept)

          searchDir.readdir(opts, dept);
        }
        searchDir.checkPending(opts.cb);

      }

      else searchDir.checkPending(opts.cb);
    },

    isFile: {
      isFile: function(x, opts) {
        var extsFilter

        countFiles++

        extsAllowDefaults = ["js", "css", "html", "php"]

        x.ext = path.extname(x.file).replace(/\./g, '')

        if (!opts.extsAllow || !opts.extsAllow.length) extsFilter = extsAllowDefaults.includes(x.ext)

        else extsFilter = opts.extsAllow.includes(x.ext)

        if (extsFilter) {
          totalSize += x.stat["size"]

          FilesAllowed++

          if (opts.type === "Directory") searchDir.isFile.FileExt(x, opts)

          else if (opts.type === "FileExt") searchDir.isFile.FileExt(x, opts)

          else if (opts.type === "FileContents") searchDir.isFile.FileContents(x, opts)

          else if (opts.type === "FileName") searchDir.isFile.FileName(x, opts)

        }

        else searchDir.checkPending(opts.cb);
      },

      FileContents11: function(x, opts) {
        var myInterface = readline.createInterface({
          input: fs.createReadStream(x.file)
        });

        myInterface
          .on('line', function(line) {

          var regex = new RegExp(opts.search, "g");

          var match = regex.exec(line)

          if (match) {
            searchDir.pushOut(x, opts)
            myInterface.close();
            myInterface.destroy();
          }
        })
          .on('close', function(err) {
          searchDir.checkPending(opts.cb);
        })

      },

      FileContents: function(x, opts) {
        i++
        var data = '';
        var length = 0;
        var reverse = 55;
        var postStr = {}
        var readableStream = {}
        //    postStr.i = '';
        readableStream = fs.createReadStream(x.file);

        readableStream
          .on("data", function(chunk) {
          data = '';
          data += chunk;
          length = data.length;
          //   postStr[i] = data.substring(length - reverse, length);

          var regex = new RegExp(opts.search, "g");

          var match = regex.exec(data)

          if (match) {
            searchDir.pushOut(x, opts)
            readableStream.destroy();
          }

        })
          .on('close', function(err) {
          searchDir.checkPending(opts.cb);
        });

      },

      FileName: function(x, opts) {

        var regex = new RegExp(opts.search, "g");

        var match = regex.exec(path.basename(x.file))

        if (match) searchDir.pushOut(x, opts)

        searchDir.checkPending(opts.cb);
      },

      FileExt: function(x, opts) {
        searchDir.pushOut(x, opts)
        searchDir.checkPending(opts.cb);
      }
    },

    pushOut: function(x, opts, type) {
      var jj = path.dirname(x.file)
      //console.log(pending)
      countMatched++

      var mat = {
        size: x.stat["size"],
        ext: x.ext,
        path1: opts.dir,
        path2: x.file,
        resolve: path.resolve(x.file),
        path: jj,
        filename: path.basename(x.file),
        mtimeMs: x.stat["mtimeMs"],
        ctimeMs: x.stat["ctimeMs"],
        birthtimeMs: x.stat["birthtimeMs"],
        atimeMs: x.stat["atimeMs"]
      }

      xxxx = [mat]

      if (type === "folders") results.directories.push(mat)

      else results.files.push(mat);
      //  results.push(mat);
      //em.emit('FirstEvent', xxxx);

      //   searchDir.checkPending(opts.cb);
      // searchDir.checkPending(opts.cb);
      // console.log('push:' + pending)
    },

    done: function(cb) {
      var err = 'c'
      searchDir.dirInfo();
      return cb(err, results);
    },

    dirInfo: function(done) {
      results.dirInfo = {
        countMatched: Number(countMatched).toLocaleString(),
        countFolders: Number(countFolders).toLocaleString(),
        count: Number(count).toLocaleString(),
        countskipped: Number(countFiles - FilesAllowed).toLocaleString(),
        countFiles: Number(countFiles).toLocaleString(),
        FilesAllowed: Number(FilesAllowed).toLocaleString(),
        totalTime: totalTime(),
        totalSize: bytesToSize(totalSize)
      }
      //   return done(null, results);
    },

    checkPending: function(cb) {

      /*  if (eret) {
    console.log('1:')
    pending = 0
    return;
  }*/
      --pending
      // console.log('push:' + pending)
      if (!pending) searchDir.done(cb)
    },

    ignorer: function(v, opts) {
      var ignore2 = "node_mduoles|abxo1|^bxo"

      if (opts.ignore) ignore2 = ignore2 + '|' + opts.ignore

      var ignore = new RegExp(ignore2, "g");

      return ignore.test(v)

    }
  }

  return searchDir.init(opts)
}

module.exports = getDir
