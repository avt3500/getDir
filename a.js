
  function finished(res) {
    jsort(res.files, 'filename')
    jsort(res.directories, 'filename')
    var dc = res.files.slice(0, 455)
    var jj = ''

    res.directories.forEach(function(v) {
      jj += `<li rel="${v.path}"class="file1 iconx ${v.ext}">${v.filename} --- ${v.path}</li>`
    });

    dc.forEach(function(v) {
      jj += `
<li 
class="file1 iconx ${v.ext}" 
data-path="${v.path}"
>${v.filename} --- ${v.path}</li>`
    });
    return jj

    // addicon()
  }
