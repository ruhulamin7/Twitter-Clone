// select elements
const tweetInputField = document.querySelector('textarea#create_tweet');
const tweetBtn = document.querySelector('button#tweet_btn');

// tweet button disable/enable function
tweetInputField.addEventListener('input', function (e) {
  const value = this.value;
  console.log(value);
  if (value) {
    tweetBtn.removeAttribute('disabled');
    tweetBtn.classList.remove('dis_btn');
  } else {
    tweetBtn.classList.add('dis_btn');
    tweetBtn.setAttribute('disabled', true);
  }
});
