const replyBtn = document.querySelector('#reply_btn');
const replyText = document.querySelector('#reply_text');
const replyImgInput = document.querySelector('#reply_img');
const replyImageContainer = document.querySelector(
  '.reply_image_inner_container'
);
let tweetContainer = document.querySelector('.tweet_container');

let replyImages = [];

// create tweet and show on UI
function createTweet(data, pinned) {
  let newData = data;
  let retweetedHtml = '';
  let replyToHtml = '';
  let deleteButton = '';
  let pinButton = '';

  if (data.tweetedBy?._id === user._id) {
    deleteButton = `<button class="deleteButton btn btn-light" onclick="deleteTweet('${data._id}')">
       <i class="fas fa-xmark"></i>
       </button>`;

    // check current page is profile page or home page
    const path = window.location.pathname;
    let p = path.split('/').includes('profile');
    if (p && !data.replyTo) {
      pinButton = `<button class="pinButton btn btn-light ${
        data.pinned ? 'pin_active' : ''
      }" onclick="pinTweet('${data._id}', ${data.pinned})">
         <i class="fas fa-thumbtack"></i>
         </button>`;
    }
  }

  if (data.originalTweet) {
    newData = data.originalTweet;
    retweetedHtml = `
      <p class="retweet_tag">
      <i class="fas fa-retweet"></i>
      ${
        data.tweetedBy.username === user.username
          ? `<a href=/profile/${data.tweetedBy.username}> You </a>retweeted`
          : `Retweeted by @<a href='/profile/${data.tweetedBy.username}'>${data.tweetedBy.username}</a>`
      }
      </p>
      `;
  }

  if (data.replyTo?.tweetedBy?.username) {
    replyToHtml = `<div class="replyingFlag">
       <p>replying to @<a href="/profile/${data.replyTo.tweetedBy.username}">${data.replyTo.tweetedBy.username}</a>
       </div>`;
  }

  const {
    _id: tweetId,
    content,
    createdAt,
    images: tweetImages,
    tweetedBy: {
      _id,
      firstName,
      lastName,
      username,
      userAvatar,
      activeStatus,
      lastSeen,
    },
    likes,
    retweetedUsers,
    repliedTweets,
  } = newData;

  const cratedTime = new Date(createdAt).getTime();
  const time = timeSince(cratedTime);
  const div = document.createElement('div');

  const avatarURL = userAvatar
    ? `/uploads/${_id}/profile/${userAvatar}`
    : `/uploads/profile/avatar.png`;

  let pinFlag = '';
  if (pinned) {
    // div.classList.add('pinTweet');
    pinFlag = `
        <div class="ms-2 mt-3 ">
          <i class="fas fa-thumbtack"></i>
          <i class="bg-dark text-light p-1 rounded-3">Pin Tweet</i>
        </div>`;
  }

  let activeText = activeStatus
    ? 'Active Now'
    : new Date(lastSeen)?.toString() !== 'Invalid Date'
    ? 'Last Seen: ' + new Date(lastSeen)?.toDateString()
    : 'Not Recently Seen';

  let isActive =
    user._id.toString() == _id.toString() || activeText == 'Active Now';
  activeText = isActive ? 'Active Now' : activeText;

  div.innerHTML = `
    ${pinFlag}
    ${retweetedHtml}
  <div class='tweet ${pinned ? 'pinTweet' : ''}'>
    <div class="tweet_profile_img">
      <div class="img">
          <div class="active_status tweet_active_status ${
            isActive && 'online'
          }" data-active_status="${activeText}"></div>
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
      <div class="btns_wrapper">
        ${pinButton}
        ${deleteButton}
      </div>  
  
    </div>
    ${replyToHtml}
    <div class="tweet_content">
        ${content}
    </div>
    <div class="tweet_images_wrapper">
  
    </div>
    <div class="tweet_activities">
        <button class="reply_tweet" data-tweet='${JSON.stringify(
          data
        )}' onclick="replyTweet(event, '${tweetId}')" data-tag="Reply" data-bs-toggle='modal' data-bs-target='#replyModal'>
          <i class="fas fa-comment"></i> 
          <span>${repliedTweets.length || ''}</span>
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

// clear reply field
function clearReplyField() {
  replyText.value = '';
  replyImageContainer.innerHTML = '';
  replyImages = [];
  replyBtn.setAttribute('disabled', true);
  replyBtn.classList.add('dis_btn');
  replyBtn.style.backgroundColor = '#a3cff0';
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

// reply tweet
function replyTweet(event, tweetId) {
  const replyButton = event.target;
  const tweetObj = JSON.parse(replyButton.dataset?.tweet);
  const modal = document.querySelector('#replyModal');
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = '';
  const tweetEl = createTweet(tweetObj);
  modalBody.appendChild(tweetEl);

  // post reply data
  replyBtn.addEventListener('click', function (e) {
    const content = replyText.value;
    if (!(replyImages.length || content)) return;
    const formData = new FormData();
    formData.append('content', content);

    replyImages.forEach((file) => {
      formData.append(file.name, file);
    });

    const url = `${window.location.origin}/tweets/reply/${tweetId}`;
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
  // $('#replyModal').modal('toggle');
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

// logout functionality
const userThreeDotBtn = document.querySelector('.user_dot_btn');

userThreeDotBtn.addEventListener('click', () => {
  const logoutBtn = document.querySelector('#logout_btn');
  // console.log(...logoutBtn.classList);
  if ([...logoutBtn.classList].includes('d-none')) {
    logoutBtn.classList.remove('d-none');
  } else {
    logoutBtn.classList.add('d-none');
  }
});

document.addEventListener('click', function (e) {
  const logoutBtn = document.querySelector('#logout_btn');
  // console.log(e.target.localName);
  if (e.target.localName !== 'i') {
    logoutBtn.classList.add('d-none');
  }
});

// pin tweet handler
function pinTweet(tweetId, pinned) {
  Swal.fire({
    title: 'Are you sure?',
    text: pinned
      ? 'You are going to unpin this tweet!'
      : 'You can only pin one tweet at a time !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: 'gray',
    confirmButtonText: pinned ? 'Yes, unpin it!' : 'Yes, pin it!',
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/tweets/${tweetId}/pin`;
      fetch(url, {
        method: 'PUT',
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data._id) {
            window.location.reload();
            console.log(data);
          } else {
            location.href = '/';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

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

// following users list
function createFollowingElement(data) {
  const name = data.firstName + ' ' + data.lastName;
  const isFollowing = data?.followers?.includes(user._id);
  const avatarURL = data.userAvatar
    ? `/uploads/${data._id}/profile/${data.userAvatar}`
    : `/uploads/profile/avatar.png`;

  let followDiv = '';
  let activeText = data.activeStatus
    ? 'Active Now'
    : new Date(data.lastSeen)?.toString() !== 'Invalid Date'
    ? 'Last Seen: ' + new Date(data.lastSeen)?.toDateString()
    : 'Not Recently Seen';

  let isActive =
    user._id.toString() == data._id.toString() || activeText == 'Active Now';
  activeText = isActive ? 'Active Now' : activeText;

  if (data._id !== user._id) {
    followDiv = `
    <button class="fl_btn ${
      isFollowing ? 'following_btn' : ''
    }" onclick="followHandler(event, '${data._id}')">
    ${isFollowing ? 'Following' : 'Follow'}
    </button>
    `;
  }

  let div = document.createElement('div');
  div.classList.add('follow_list');

  div.innerHTML = `
    <div class="follow_profile">
      <div class="avatar img">
      <div class="active_status tweet_active_status ${
        isActive && 'online'
      }" data-active_status="${activeText}"></div>
        <img src="${avatarURL}">
      </div>
      <div class="follow_name">
        <a href="/profile/${data.username}">
          <h6>${name}</h6>
        </a>
        <span>@${data.username}</span>
      </div>
    </div>
    <div>
      ${followDiv}
    </div>
  `;

  return div;
}

function followHandler(event, userId) {
  const url = `${window.location.origin}/profile/${userId}/follow`;
  fetch(url, {
    method: 'PUT',
  })
    .then((res) => res.json())
    .then((data) => {
      const followBtn = event.target;
      const isFollowing = data.followers.includes(user._id);

      const following = document.querySelector('a.following span');
      const followers = document.querySelector('a.followers span');

      if (isFollowing) {
        if (profileUser._id === user._id) {
          following.textContent = parseInt(following.textContent) + 1 + ' ';
        }
        followBtn.textContent = 'Following';
        followBtn.classList.add('following_btn');
      } else {
        if (profileUser._id === user._id) {
          following.textContent = parseInt(following.textContent) - 1 + ' ';
        }
        followBtn.textContent = 'Follow';
        followBtn.classList.remove('following_btn');
      }

      if (data._id === profileUser._id) {
        following.textContent = data.following.length + ' ';
        followers.textContent = data.followers.length + ' ';
      }
    });
}

// socket
const socket = io('http://localhost:3005');
let isConnected = false;
// socket setup
socket.emit('setup', user);

// connection confirmation
socket.on('connected', () => {
  isConnected = true;
});
