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
    console.log(tweet);
  } catch (error) {
    console.log(error);
  }
}
// load all the tweets
loadTweets();

// show tweet to UI
function createTweet(data) {
  let newData = data;
  let retweetedHtml = '';
  let replayToHtml = '';
  if (data.originalTweet) {
    newData = data.originalTweet;
    retweetedHtml = `
    <P class="retweet_tag">
    <i class="fas fa-retweet"></i>
    ${
      data.tweetedBy.username === user.username
        ? `<a href=/profile/${data.tweetedBy.username}> You </a>retweeted`
        : `Retweeted by @<a href='/profile/${data.tweetedBy.username}'>${data.tweetedBy.username}</a>`
    }
    </P>
    `;
  }

  if (data.replayTo?.tweetedBy?.username) {
    replayToHtml = `<div class="replayingFlag">
     <p>Replaying to @<a href="/profile/${data.replayTo.tweetedBy.username}">${data.replayTo.tweetedBy.username}</a>
     </div>`;
  }

  const {
    _id: tweetId,
    content,
    createdAt,
    images: tweetImages,
    tweetedBy: { _id, firstName, lastName, username, userAvatar },
    likes,
    retweetedUsers,

    replayedTweets,
  } = newData;

  const cratedTime = new Date(createdAt).getTime();
  const time = timeSince(cratedTime);
  const div = document.createElement('div');

  div.innerHTML = `
  ${retweetedHtml}
  <div class='tweet'>
  <div class="tweet_profile_img">
  <div class="img">
      <img src="${
        window.location.origin
      }/uploads/profile/${userAvatar}" , alt="avatar" class="avatar">
  </div>
</div>

<div class="tweet_content_wrapper" onclick="viewSingleTweet(event, '${tweetId}')">
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
  ${replayToHtml}
  <div class="tweet_content">
      ${content}
  </div>
  <div class="tweet_images_wrapper">

  </div>
  <div class="tweet_activities">
      <button class="replay_tweet" data-tweet='${JSON.stringify(
        data
      )}' onclick="replayTweet(event, '${tweetId}')" data-tag="Replay" data-bs-toggle='modal' data-bs-target='#replayModal'>
        <i class="fas fa-comment"></i> 
        <span>${replayedTweets.length || ''}</span>
      </button>
      <button onclick="retweetHandler(event, '${tweetId}')" data-tag="Retweet" class="retweet ${
    retweetedUsers.includes(user._id) ? 'active' : ''
  }">
        <i class="fas fa-retweet"></i> 
        <span>${retweetedUsers.length || ''}</span>
      </button>
      
      <button onclick="likeHandler(event, '${tweetId}')" data-tag="Like" class="like ${
    user.likes.includes(tweetId) ? 'active' : ''
  }">
        <i class="fas fa-heart" ></i> 
        <span>${likes.length ? likes.length : ''}</span>
      </button>
      <button data-tag="Share">
        <i class="fas fa-share"></i> <span>2</span>
      </button>
  </div>

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

// clear replay field
function clearReplayField() {
  replayText.value = '';
  replayImageContainer.innerHTML = '';
  replayImages = [];
  replayBtn.setAttribute('disabled', true);
  replayBtn.classList.add('dis_btn');
  replayBtn.style.backgroundColor = '#a3cff0';
}

// tweet like handler
function likeHandler(event, tweetId) {
  const likeBtn = event.target;
  const span = likeBtn.querySelector('span');

  const url = `${window.location.origin}/tweet/like/${tweetId}`;
  fetch(url, {
    method: 'PUT',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.likes.includes(user._id)) {
        likeBtn.classList.add('active');
      } else {
        likeBtn.classList.remove('active');
      }
      span.innerText = data.likes.length ? data.likes.length : '';
    });
}

// retweet handler
function retweetHandler(event, tweetId) {
  const retweetBtn = event.target;
  const span = retweetBtn.querySelector('span');

  const url = `${window.location.origin}/tweet/retweet/${tweetId}`;
  fetch(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.retweetedUsers.includes(user._id)) {
        retweetBtn.classList.add('active');
        window.location.reload();
      } else {
        retweetBtn.classList.remove('active');
        window.location.reload();
      }
      span.innerText = data.retweetedUsers.length || '';
    });
}

// replay tweet
function replayTweet(event, tweetId) {
  const replayButton = event.target;
  console.log(replayButton);
  const tweetObj = JSON.parse(replayButton.dataset?.tweet);
  const modal = document.querySelector('#replayModal');
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = '';
  const tweetEl = createTweet(tweetObj);
  modalBody.appendChild(tweetEl);

  // post replay data
  replayBtn.addEventListener('click', function (e) {
    const content = replayText.value;
    if (!(replayImages.length || content)) return;
    const formData = new FormData();
    formData.append('content', content);

    replayImages.forEach((file) => {
      formData.append(file.name, file);
    });

    const url = `${window.location.origin}/tweet/replay/${tweetId}`;
    console.log(url);
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  // $('#replayModal').modal('toggle');
}

// viewSingleTweet
function viewSingleTweet(event, tweetId) {
  // console.log(event.target.localName, tweetId);
  if (event.target.localName === 'div') {
    window.location.href = `${window.location.origin}/tweet/${tweetId}`;
  }
}
