// select elements
let tweetInputEl = document.querySelector('textarea#create_tweet');
let tweetBtn = document.querySelector('button#tweet_btn');
let tweetImgInputEl = document.querySelector('#tweet_img');
let outputImageContainer = document.querySelector(
  '.output_image_inner_container'
);
let tweetContainer = document.querySelector('.tweet_container');
const replyBtn = document.querySelector('#reply_btn');
const replyText = document.querySelector('#reply_text');
const replyImgInput = document.querySelector('#reply_img');
const replyImageContainer = document.querySelector(
  '.reply_image_inner_container'
);

let tweetImages = [];
let replyImages = [];

// tweet button disable/enable function
tweetInputEl.addEventListener('input', function (e) {
  const value = this.value.trim();
  if (value || tweetImages.length) {
    tweetBtn.removeAttribute('disabled');
    tweetBtn.classList.remove('dis_btn');
  } else {
    tweetBtn.setAttribute('disabled', true);
    tweetBtn.classList.add('dis_btn');
  }
});

// reply button disable/enable function
replyText.addEventListener('input', function (e) {
  const value = this.value.trim();
  if (value || replyImages.length) {
    replyBtn.removeAttribute('disabled');
    replyBtn.classList.remove('dis_btn');
    replyBtn.style.backgroundColor = '#50abf1';
  } else {
    replyBtn.setAttribute('disabled', true);
    replyBtn.classList.add('dis_btn');
    replyBtn.style.backgroundColor = '#a3cff0';
  }
});

// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(
      `${window.location.origin}/tweets?followingOnly=true`
    );
    const tweets = await result.json();
    if (!tweets.length) {
      return (tweetContainer.innerHTML =
        '<h3 class="nothing text-center mt-3">Nothing to show :(</h3>');
    } else {
      tweets.forEach((tweet) => {
        const tweetEl = createTweet(tweet);
        tweetContainer.insertAdjacentElement('afterbegin', tweetEl);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// load all the tweets
loadTweets();

// handle tweet image upload
tweetImgInputEl.addEventListener('change', function (e) {
  const files = this.files;
  if (files.length) {
    [...files].forEach((file) => {
      const fr = new FileReader();
      fr.onload = function () {
        if (
          !['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(
            file.type
          )
        ) {
          alert('Only jpg, png, jpeg, and svg image files are allowed');
          return;
        }

        // collect image for store
        tweetImages.push(file);
        // remove disable style
        tweetBtn.removeAttribute('disabled');
        tweetBtn.classList.remove('dis_btn');

        // create div for contain image
        const div = document.createElement('div');
        div.classList.add('img_div');
        div.dataset.name = file.name;

        div.innerHTML = `
        <img>
        <span class="close_btn">
          <i class="fas fa-times"></i>
        </span>
        `;
        const img = div.querySelector('img');
        img.src = fr.result;
        outputImageContainer.appendChild(div);
      };
      fr.readAsDataURL(file);
    });
  }
});

// handle reply image upload
replyImgInput.addEventListener('change', function (e) {
  const files = this.files;
  if (files.length) {
    [...files].forEach((file) => {
      const fr = new FileReader();
      fr.onload = function () {
        if (
          !['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(
            file.type
          )
        ) {
          alert('Only jpg, png, jpeg, and svg image files are allowed');
          return;
        }

        // collect image for store
        replyImages.push(file);
        // remove disable style
        replyBtn.removeAttribute('disabled');
        replyBtn.classList.remove('dis_btn');
        replyBtn.style.backgroundColor = '#50abf1';

        // create div for contain image
        const div = document.createElement('div');
        div.classList.add('img_div');
        div.dataset.name = file.name;

        div.innerHTML = `
        <img>
        <span class="close_btn">
          <i class="fas fa-times"></i>
        </span>
        `;
        const img = div.querySelector('img');
        img.src = fr.result;
        replyImageContainer.appendChild(div);
      };
      fr.readAsDataURL(file);
    });
  }
});

// remove image from UI and stored variable
outputImageContainer.addEventListener('click', function (e) {
  const closeBtn = e.target.className === 'close_btn' ? e.target : null;
  if (!closeBtn) {
    return;
  } else {
    const imgEl = closeBtn.parentElement;
    const fileName = imgEl.dataset.name;
    tweetImages.forEach((img, i) => {
      if (img.name === fileName) {
        tweetImages.splice(i, 1);
        imgEl.remove();
        if (!tweetImages.length && !tweetInputEl.value.trim()) {
          tweetBtn.setAttribute('disabled', true);
          tweetBtn.classList.add('dis_btn');
        }
      }
    });
  }
});

// remove image from reply Ui and stored variable
replyImageContainer.addEventListener('click', function (e) {
  const closeBtn = e.target.className === 'close_btn' ? e.target : null;
  if (!closeBtn) {
    return;
  } else {
    // replyImages = [];
    const imgEl = closeBtn.parentElement;
    const fileName = imgEl.dataset.name;
    replyImages.forEach((img, i) => {
      if (img.name === fileName) {
        replyImages.splice(i, 1);
        imgEl.remove();
        if (!replyImages.length && !replyText.value.trim()) {
          replyBtn.setAttribute('disabled', true);
          replyBtn.classList.add('dis_btn');
          replyBtn.style.backgroundColor = '#a3cff0';
        }
      }
    });
  }
});

// post tweet data
tweetBtn.addEventListener('click', function () {
  const content = tweetInputEl.value;
  if (!(tweetImages.length || content)) return;

  const formData = new FormData();
  formData.append('content', content);
  tweetImages.forEach((file) => {
    formData.append(file.name, file);
  });
  // const url = window.location.protocol + '//' + window.location.host;
  const url = `${window.location.origin}/tweets`;
  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const tweetEl = createTweet(data);
      tweetContainer.insertAdjacentElement('afterbegin', tweetEl);
      clearTweetField();
    })
    .catch((err) => {
      console.log(err);
    });
});
