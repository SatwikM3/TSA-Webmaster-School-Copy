once = true;
$(window).on('scroll',function() {
  if (checkVisible($('#demo'))) {
if (once) {
  once=false;
    var botui = new BotUI('bot'); 

botui.message.bot({ // show first message
  delay: 100,
  content: 'Hello. I\'m A.I.D.A. I am your personal tutor!',
  loading: true 

}).then(function () {
  return botui.message.bot({ // second one
    delay: 100,
    loading: true,
    content: 'I can help you study topics and prepare for upcoming exams.'
  });
}).then(function () {
  return botui.message.bot({ // third one
    delay: 100,
    loading: true,
    content: 'Send me a picture of content you\'re learning to get started.'
  });
}).then(function () {
  return botui.action.button({ // let user choose something
    delay: 0,
    action: [{
      text: 'Send Math Sheet',
      value: 'math'
    }, {
      text: 'Send Science Sheet',
      value: 'science'
    }, {
      text: 'Send History Sheet',
      value: 'history'
    }]
  });
}).then(function () {
  return botui.action.bot({
    delay: 0,
    loading: false,
    content: 'hhhb'
  })}).then(function (res) {
  return botui.message.bot({
    delay: 500,
    loading: true, 
    content: 'Thanks! Please give me a moment to analyze your ' + res.value.toLowerCase() + ' document.'
  });
}).then(function () {
  botui.message.bot({
    delay: 700,
    loading: true,
    content: 'By the way, what\'s your name ?'
  }).then(function () {
    return botui.action.text({
      delay: 400,
      action: {
        size: 18,
        icon: 'user-circle-o',
        sub_type: 'text',
        placeholder: 'John ?'
      }
    });
  }).then(function (res) {
    name = res.value; // save new value
    return botui.message.bot({
      delay: 300,
      loading: true,
      content: 'Nice to meet you ' + name + '! ![hello image](https://media.giphy.com/media/DwXOS8RqHocEM/giphy.gif)'
    });
  });
});
  } else {
      // do nothing
  }
}
});
function checkVisible(elm, eval) {
  eval = eval || "object visible";
  var viewportHeight = $(window).height(), // Viewport Height
    scrolltop = $(window).scrollTop(), // Scroll Top
      y = $(elm).offset().top,
      elementHeight = $(elm).height(); 

      if (eval == "object visible") {
          ok = (y < (viewportHeight/2 + scrolltop)) && (y > (scrolltop - elementHeight))
          return ok;
      } if (eval == "above") return ((y < (viewportHeight + scrolltop)));
}
