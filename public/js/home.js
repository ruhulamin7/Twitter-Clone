// select elements
let tweetInputEl = document.querySelector('textarea#create_tweet');
let tweetBtn = document.querySelector('button#tweet_btn');

let tweetImgInputEl = document.querySelector('#tweet_img');
let outputImageContainer = document.querySelector(
  '.output_image_inner_container'
);
let tweetContainer = document.querySelector('.tweet_container');
let tweetImages = [];

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

// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(`${window.location.origin}/tweet`);
    const tweets = await result.json();
    if (!tweets.length) {
      return (tweetContainer.innerHTML =
        '<h3 class="nothing text-center mt-3">No tweets :(</h3>');
    } else {
      tweets.forEach((tweet) => {
        const tweetEl = showTweetUI(tweet);
        tweetContainer.insertAdjacentElement('afterbegin', tweetEl);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// load all the tweets
loadTweets();

// handle image upload
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
  const url = `${window.location.origin}/tweet`;
  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const tweetEl = showTweetUI(data);
      tweetContainer.insertAdjacentElement('afterbegin', tweetEl);
      clearTweetField();
    })
    .catch((err) => {
      console.log(err);
    });
});

// show tweet data to UI
function showTweetUI(data) {
  const {
    _id: tweetId,
    content,
    createdAt,
    images: tweetImages,
    tweetedBy: { _id, firstName, lastName, email, username, userAvatar },
    likes,
  } = data;

  const cratedTime = new Date(createdAt).getTime();
  const time = timeSince(cratedTime);

  const div = document.createElement('div');
  div.classList.add('tweet');

  div.innerHTML = `
  <div class="tweet_profile_img">
  <div class="img">
      <img src="${
        window.location.origin
      }/uploads/profile/${userAvatar}" , alt="avatar" class="avatar">
  </div>
</div>

<div class="tweet_content_wrapper">
  <div class="tweet_user">
      <div>
          <a href="/profile/${username}" class="name">${
    firstName + ' ' + lastName
  }</a>
          <span class="username">@${username + ' ' + '.' + ' '}</span> 
          <span class="time">${time}</span>
      </div>
      <i class="fas fa-ellipsis-h"></i>
  </div>
  <div class="tweet_content">
      ${content}
  </div>
  <div class="tweet_images_wrapper">

  </div>
  <div class="tweet_activities">
      <button data-tag="Replay">
        <i class="fas fa-comment"></i> 
        <span>12</span>
      </button>
      <button data-tag="Retweet">
        <i class="fas fa-retweet"></i> 
        <span>121</span>
      </button>
      <button onclick="likeHandler(event, '${tweetId}')" data-tag="Like">
        <i class="fas fa-heart" ></i> 
        <span>${likes.length ? likes.length : ''}</span>
      </button>
      <button data-tag="Share">
        <i class="fas fa-share"></i> <span>2</span>
      </button>
  </div>
</div>
  `;
  // append tweet
  tweetContainer.appendChild(div);
  // append tweet images
  const tweetImagesWrapper = div.querySelector('.tweet_images_wrapper');
  if (tweetImages.length) {
    tweetImages.forEach((img) => {
      const imgDiv = document.createElement('div');
      imgDiv.classList.add('img');
      imgDiv.innerHTML = `<img src="${window.location.origin}/uploads/${_id}/tweets/${img}" att=""/>`;
      tweetImagesWrapper.appendChild(imgDiv);
    });
  } else {
    tweetImagesWrapper.hidden = true;
  }
  return div;
}

// show realtime at tweet
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return 'Just now';
}

// clear tweet field
function clearTweetField() {
  tweetInputEl.value = '';
  outputImageContainer.innerHTML = '';
  tweetImages = [];
  tweetBtn.setAttribute('disabled', true);
  tweetBtn.classList.add('dis_btn');
}

// tweet like handler
function likeHandler(event, tweetId) {
  const likeBtn = event.target;
  const url = `${window.location.origin}/tweet/like/${tweetId}`;
  fetch(url, {
    method: 'PUT',
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
    });
}
