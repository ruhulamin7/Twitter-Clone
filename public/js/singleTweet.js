const tweetContainer = document.querySelector('.tweet_container');
const replyBtn = document.querySelector('#reply_btn');
const replyText = document.querySelector('#reply_text');
const replyImgInput = document.querySelector('#reply_img');
const replyImageContainer = document.querySelector(
  '.reply_image_inner_container'
);

let tweetImages = [];
let replyImages = [];
// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(
      `${window.location.origin}/tweets/single/${tweetId}`
    );
    const tweet = await result.json();

    if (tweet === null) {
      return (location.href = '/');
    }

    const tweetEl = createTweet(tweet);
    tweetContainer.appendChild(tweetEl);

    tweet.repliedTweets.forEach(async (tweetId) => {
      const result = await fetch(
        `${window.location.origin}/tweets/single/${tweetId}`
      );
      const tweet = await result.json();
      const tweetEl = createTweet(tweet);
      tweetContainer.appendChild(tweetEl);
    });
  } catch (error) {
    location.href = '/';
  }
}
// load all the tweets
loadTweets();

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
