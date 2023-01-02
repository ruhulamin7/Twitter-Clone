// create tweet and show on UI
function createTweet(data) {
  let newData = data;
  let retweetedHtml = '';
  let replayToHtml = '';
  let deleteButton = '';
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

  if (data.tweetedBy?._id === user._id) {
    deleteButton = `<button class="deleteButton btn btn-light" onclick="deleteTweet('${data._id}')">
       <i class="fas fa-xmark"></i>
       </button>`;
  }

  const cratedTime = new Date(createdAt).getTime();
  const time = timeSince(cratedTime);
  const div = document.createElement('div');

  const avatarURL = userAvatar
    ? `/uploads/${_id}/profile/${userAvatar}`
    : `/uploads/profile/avatar.png`;

  div.innerHTML = `
    ${retweetedHtml}
    <div class='tweet'>
    <div class="tweet_profile_img">
    <div class="img">
        <img src="${avatarURL}" , alt="avatar" class="avatar">
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
        ${deleteButton}
  
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

// common functions
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

  const url = `${window.location.origin}/tweets/like/${tweetId}`;
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

  const url = `${window.location.origin}/tweets/retweet/${tweetId}`;
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

    const url = `${window.location.origin}/tweets/replay/${tweetId}`;
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          console.log(data);
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
    window.location.href = `${window.location.origin}/tweets/${tweetId}`;
  }
}
// delete tweet
function deleteTweet(tweetId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/tweets/${tweetId}`;
      fetch(url, {
        method: 'DELETE',
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
    }
  });
}

const user_dot_btn = document.querySelector('.user_dot_btn');
user_dot_btn.addEventListener('click', () => {
  const logout_btn = document.querySelector('#logout_btn');
  // console.log(...logout_btn.classList);
  if ([...logout_btn.classList].includes('d-none')) {
    logout_btn.classList.remove('d-none');
  } else {
    logout_btn.classList.add('d-none');
  }
});

document.addEventListener('click', function (e) {
  const logout_btn = document.querySelector('#logout_btn');
  // console.log(e.target.localName);
  if (e.target.localName !== 'i') {
    logout_btn.classList.add('d-none');
  }
});
