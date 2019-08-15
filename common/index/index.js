$(function () {
  /* 通用 */
  $.getQueryString = function (name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)")
    var r = window.location.search.substr(1).match(reg)
    if(r!=null){
      return decodeURI(r[2])
    }else{
      return ''
    }
  }
  let Works
  let query = $.getQueryString('query')
  $.ajax({
    url: './data.json',
    type: 'GET',
    async: false,
    dataType: 'json',
    success: function (data) {
      Works = data.data
      let newWork = getWorksByTag(query, Works)
      createHtml(newWork)
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
    clearTag()
  })
  $('.works').on('click', '.tag span', function(){
    let tag = $(this).text()
    let newWork = getWorksByTag(tag, Works)
    createHtml(newWork)
    clearTag(true)
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
    if(works.length <= 0) {
      noData()
      return
    }
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

  function noData() {
    let newHtml = `<li class="no-data">
                    <img src="common/index/no_data.png" alt="暂无搜索内容">
                    <p>未找到该案例~<br>
                      但我们可以为您定制开发，请联系<a title="邮箱:business@bingblue.com" href="mailto:business@bingblue.com">我们</a>！</p>
                  </li>`
    $(newHtml).appendTo($('.works'))
  }

  // 重置标签
  function clearTag(clearIpt) {
    if(clearIpt) $('.go input').val('')
    $('.search .active').removeClass('active')
    $('.search a').eq(0).parent().addClass('active')
  }
})
