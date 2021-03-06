$(function() {

  var request = require('request')

  

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
