$(function() {

  var request = require('request')

  function addHtml() {
    var m =
      '<div id="textDiv">' +
      '    <input type="text" class="textBox" id="text" value="https://github.com/codemirror/CodeMirror">' +
      '    <input type="button" class="button" id="button" value="button">' +
      '</div>' +
      '<div id="list"></div>';
    $('body').append(m)
  }

  function gitName() {
    return $('#text').val().replace(/https:\/\/github.com\//g, '')
  }

  function getTree(code) {
    function vxv(err, resp, html) {
      var upFolderPath = function(pathh) {
        if (!pathh.includes("/")) return "top"
        var upPath = pathh.replace(/\/$/g, '')
        upPath = upPath.replace(/\/[^\/]*?$/g, '')
        if (upPath === '') upPath = '/'
        return upPath
      }
      var vg = JSON.parse(html)
      tree = vg.tree
      console.log(tree)
      $.each(tree, function(k, v) {
        var u = v.path
        v.zzz = upFolderPath(u)
        v.name = u.split("/").pop()
      });
      outPutTree("top", $('#list'))
      console.log(treey)
    }

    request.get({
      method: 'GET',
      url: code,
      headers: {
        'User-Agent': 'Super Cool Browser' // optional headers
      }
    }, vxv);
  }

  function outPutTree(code, targ) {
    cc = []
    treey = {
      files: [],
      dirs: []
    }
    $.each(tree, function(k, v) {
      if (v.zzz == code) {
        if (v.type == "blob") treey.files.push(v)
        if (v.type == "tree") treey.dirs.push(v)
      }
    });
    $.each(treey.dirs, function(k, v) {
      div = $('<div/>', {
        addClass: 'directory icon-folder collapsed',
        rel: this.path,
        html: this.name
      })
      ul = $('<ul/>', {
        addClass: 'jqueryFileTre'
      })
      $('<li/>', {
        'data-ext': 'dir',
        addClass: 'ow',
        rel: this.path,
        html: div,
        append: ul,
        pushTo: cc
      })
    });
    $.each(treey.files, function(k, v) {
      var clas = getIcon(v.name)
      $('<li/>', {
        'data-ext': 'dir',
        addClass: clas,
        rel: this.path,
        html: v.name,
        pushTo: cc
      })
    });
    targ.html(cc)
  }

  function getCode(code) {
    function getCodeSuccess(jo) {
      var ext = code.split(".").pop()
      var mode = getMode(ext)

      CodeMirror.requireMode(mode.info, function() {
        console.log(mode)
        editorjs.setValue(jo)
        editorjs.setOption("mode", mode.info);
        CodeMirror.commands.foldAll(editorjs)
        editorjs.refresh()
      });

    }
    $.ajax({
      data: {
        getFile: $(this).attr('href')
      },
      type: "GET",
      url: "https://raw.githubusercontent.com/" + gitName() + "/master/" + code,
      dataType: "text",
      success: getCodeSuccess
    });

  }

  function clicks() {

    $(document).on('click', '#button', function() {
      getTree("https://api.github.com/repos/" + gitName() + "/git/trees/master?recursive=1")
    });
    $(document).on('click', '.file1', function() {
      $(this).currentClass("current")
      getCode($(this).attr('rel'))
    });
    $(document).on('click', '.directory', function() {
      var targ = $(this)
      var targUl = targ.siblings("ul")

      if (targ.is(".collapsed")) {
        targ.addClass("expanded")
        targ.removeClass("collapsed")

        if (!targUl.find("li").length) outPutTree(targ.attr('rel'), targUl)

        targUl.show()
      }
      else {

        targ.addClass("collapsed")
        targ.removeClass("expanded")
        targUl.hide()
      }
    });
  }

  function init() {
    $("body").append('<div id="code"/>')
    $("#code").addEditor("editorjs", "js", {
      lint: false
    })

    addHtml()

    clicks()
  }

  init()
})
