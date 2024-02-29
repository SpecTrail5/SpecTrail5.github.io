
$(document).ready(() => {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  const $body = $('body');

  const $content = $('.content');

  window.visitor = 'whatever';

  const style = {
    background: '#373D3E',
    color: 'white',
    width: '500',
    padding: 5,
    margin: 20,
    'font-size': 20,
    'border-radius': 10
  };

  const $button = $('<button>refresh</button>').attr('id', 'new-tweet').css('width', 'auto').css('height', 'auto');
  $content.append($button);
  //creates a new button and appends it to the body
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);

  function newFrame() {
    let ran = Math.random() * 10

    if (ran % 2 === 0) {
      setTweet
    }
  }



  function setTweet() {
    scheduleNextTweet()
    const $tweets = streams.home.map((tweet) => {
      const $tweet = $(`<div class= tweets class = ${tweet.user} ></div>`).css(style);
      const timeAgo = dayjs(tweet.created_at).fromNow();
      const text = `@${tweet.user}: ${tweet.message}, Created: ${timeAgo}`;


      $tweet.text(text);
      ($tweet).on('click', function () {

        const shawndrost = $('.shawndrost');
        const mracus = $('.mracus');
        const sharksforcheap = $('.sharksforcheap');
        const douglascalhoun = $('.douglascalhoun');

        if ($tweet.attr('class') === 'shawndrost') {
          // this statment hides the tweets everyone but shawndrost

          $(mracus).hide();
          $(sharksforcheap).hide();
          $(douglascalhoun).hide();

        }

        if ($tweet.attr('class') === 'mracus') {
          // this statment hides the tweets everyone but shawndrost

          $(shawndrost).hide();
          $(sharksforcheap).hide();
          $(douglascalhoun).hide();

        }

        if ($tweet.attr('class') === 'sharksforcheap') {
          // this statment hides the tweets everyone but shawndrost

          $(shawndrost).hide();
          $(mracus).hide();
          $(douglascalhoun).hide();

        }

        if ($tweet.attr('class') === 'douglascalhoun') {
          // this statment hides the tweets everyone but shawndrost

          $(shawndrost).hide();
          $(mracus).hide();
          $(sharksforcheap).hide();

        }


      });
      return $tweet;
    });
    // when the button is clicked, create divs for each new tweet


    $('.tweets').remove();
    $content.append($tweets);


    // gets rid of the old tweets, and refreshes so that it puts all of the tweest without repeating
  };


  const $submit = $('<button>submit</button>').css('width', 'auto').css('height', 'auto');
  const $form = $('<form></form>')
    .append('<input type="form" placeholder=" message">')
    .append($submit);

  $content.append($form);

  $submit.on('click', function (e) {
    e.preventDefault();

    let message = $('input').val();
    //console.log(message);
    if (!streams.users[window.visitor]) {
      streams.users[window.visitor] = [];
    }

    writeTweet(message);

  });

  //when a div is clicked,
  //for example if the id = shawn, it will hide everything else that doesnt have the id

});
