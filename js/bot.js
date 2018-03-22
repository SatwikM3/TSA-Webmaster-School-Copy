once = true;
$(window).on('scroll',function() {
  if (checkVisible($('#demo'))) {
if (once) {
  once=false;
    var botui = new BotUI('bot'); // give it the id of container

botui.message.bot({ // show first message
  delay: 100,
  content: 'Hi, I\'m AIDA, your virtual tutor',
  loading: true // fake typing

}).then(function () {
  return botui.message.bot({ // second one
    delay: 100,
    loading: true,
    content: 'That stands for Artifical Intelligent Digital Assistant.'
  });
}).then(function () {
  return botui.action.button({ // let user choose something
    delay: 0,
    action: [{
      text: 'Who created you?',
      value: 'good'
    }, {
      text: 'What can you do?',
      value: 'really_good'
    }, {
      text: 'Why do you exist?',
      value: 'awfully_good'
    }]
  });
}).then(function (res) {
  return botui.message.bot({
    delay: 400,
    loading: true, // pretend like we are doing something
    content: 'You are feeling ' + res.text.toLowerCase() + '!'
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
