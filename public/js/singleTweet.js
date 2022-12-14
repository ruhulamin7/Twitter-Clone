const tweetContainer = document.querySelector('.tweet_container');
const replayBtn = document.querySelector('#replay_btn');
const replayText = document.querySelector('#replay_text');
const replayImgInput = document.querySelector('#replay_img');
const replayImageContainer = document.querySelector(
  '.replay_image_inner_container'
);

let tweetImages = [];
let replayImages = [];
// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(
      `${window.location.origin}/tweet/single/${tweetId}`
    );
    const tweet = await result.json();

    if (tweet === null) {
      return (location.href = '/');
    }

    const tweetEl = createTweet(tweet);
    tweetContainer.appendChild(tweetEl);

    tweet.replayedTweets.forEach(async (tweetId) => {
      const result = await fetch(
        `${window.location.origin}/tweet/single/${tweetId}`
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
replayText.addEventListener('input', function (e) {
  const value = this.value.trim();
  if (value || replayImages.length) {
    replayBtn.removeAttribute('disabled');
    replayBtn.classList.remove('dis_btn');
    replayBtn.style.backgroundColor = '#50abf1';
  } else {
    replayBtn.setAttribute('disabled', true);
    replayBtn.classList.add('dis_btn');
    replayBtn.style.backgroundColor = '#a3cff0';
  }
});

// handle replay image upload
replayImgInput.addEventListener('change', function (e) {
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
        replayImages.push(file);
        // remove disable style
        replayBtn.removeAttribute('disabled');
        replayBtn.classList.remove('dis_btn');
        replayBtn.style.backgroundColor = '#50abf1';

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
        replayImageContainer.appendChild(div);
      };
      fr.readAsDataURL(file);
    });
  }
});

// remove image from replay Ui and stored variable
replayImageContainer.addEventListener('click', function (e) {
  const closeBtn = e.target.className === 'close_btn' ? e.target : null;
  if (!closeBtn) {
    return;
  } else {
    // replayImages = [];
    const imgEl = closeBtn.parentElement;
    const fileName = imgEl.dataset.name;
    replayImages.forEach((img, i) => {
      if (img.name === fileName) {
        replayImages.splice(i, 1);
        imgEl.remove();
        if (!replayImages.length && !replayText.value.trim()) {
          replayBtn.setAttribute('disabled', true);
          replayBtn.classList.add('dis_btn');
          replayBtn.style.backgroundColor = '#a3cff0';
        }
      }
    });
  }
});
