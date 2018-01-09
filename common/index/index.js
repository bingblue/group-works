$(function () {
  let Works
  $.ajax({
    url: './data.json',
    type: 'GET',
    async: false,
    dataType: 'json',
    success: function (data) {
      Works = data.data
      createHtml(Works)
    },
    error: function () {
      window.location.reload(true)
    }
  })
  $('.search ul a').click(function(){
    $('.go input').val('')
    let tag = $(this).text()
    $('.search .active').removeClass('active')
    $(this).parent().addClass('active')
    let newWork = getWorksByTag(tag, Works)
    createHtml(newWork)
  })
  $('.go a').click(function(){
    $('.search .active').removeClass('active')
    let tag = $('.go input').val()
    let newWork = getWorksByTag(tag, Works)
    createHtml(newWork)
  })
  $('.works').on('click', '.tag span', function(){
    let tag = $(this).text()
    let newWork = getWorksByTag(tag, Works)
    createHtml(newWork)
    return false
  })
  function getWorksByTag(tag, works) {
    let result = []
    tag = tag.replace(/#/g,"").toUpperCase()
    if(tag == '所有' || tag == 'all' || tag == ''){
      return works
    }
    for (let i in works) {
      if(works[i].tag.indexOf(tag) > -1) {
        result.push(works[i])
      }
    }
    return result
  }
  function createHtml(works) {
    $('.works').html('')
    for (let i in works) {
      let tags = works[i].tag.split(',')
      let tagsHtml = ''
      for (let j in tags) {
        tagsHtml += `<span>#${tags[j]}</span>`
      }
      let newHtml = `<li>
                        <a target="_blank" href="${works[i].url}" title="${works[i].intro}">
                          <img src="${works[i].img}">
                          <div class="tag">${tagsHtml}</div>
                          <h3>${works[i].title}<span>${works[i].intro}</span></h3>
                        </a>
                      </li>`
      $(newHtml).appendTo($('.works'))
    }
  }
})
