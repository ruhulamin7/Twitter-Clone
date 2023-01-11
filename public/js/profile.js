const updateAvatarInput = document.querySelector('input#updateAvatarInput');
const avatarPreviewContainer = document.querySelector(
  'div#avatarPreviewContainer'
);
const avatarPreview = document.querySelector('img#avatarPreview');
const updateAvatarBtn = document.querySelector('button#updateAvatarBtn');
// select elements

let cropper;

// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(
      `${window.location.origin}/tweets?tweetedBy=${profileUser._id}&replyTo=${
        tab === 'replies'
      }`
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

    if (tab === 'tweets') {
      const pinTweetResult = await fetch(
        `${window.location.origin}/tweets?tweetedBy=${profileUser._id}&pinned=true`
      );

      const pinTweets = await pinTweetResult.json();

      pinTweets?.forEach((tweet) => {
        const tweetEl = createTweet(tweet, true);
        tweetContainer.insertAdjacentElement('afterbegin', tweetEl);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// load all the tweets
loadTweets();

// following functions
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
        followBtn.textContent = 'Following';
        followBtn.classList.add('following_btn');
        following.textContent = data.following.length + ' ';
        followers.textContent = data.followers.length + ' ';
      } else {
        followBtn.textContent = 'Follow';
        followBtn.classList.remove('following_btn');
        following.textContent = data.following.length + ' ';
        followers.textContent = data.followers.length + ' ';
      }
    });
}

// collect avatar for store
updateAvatarInput.addEventListener('change', function () {
  // console.log(this.files[0]);
  const files = this.files;
  if (files.length) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(
          files[0].type
        )
      ) {
        alert('Only jpg, png, jpeg, and svg image files are allowed');
        return;
      }
      // for preview avatar
      avatarPreview.src = reader.result;
      // avatarPreview.src = e.target.result;

      cropper = new Cropper(avatarPreview, {
        aspectRatio: 1 / 1,
        background: false,
      });
    };
    reader.readAsDataURL(files[0]);
  } else {
    console.log('Avatar photo not found!');
  }
});

// save avatar
updateAvatarBtn.addEventListener('click', function (e) {
  const canvas = cropper?.getCroppedCanvas();
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateAvatarInput?.files[0]?.name || 'avatar.png';
      const formData = new FormData();
      formData.append('userAvatar', blob, fileName);
      const url = `${window.location.origin}/profile/avatar`;
      fetch(url, {
        method: 'PUT',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    alert('Please select an image to load');
  }
});

// update cover
const updateCoverInput = document.querySelector('input#updateCoverInput');
const coverPreviewContainer = document.querySelector(
  'div#coverPreviewContainer'
);
const coverPreview = document.querySelector('img#coverPreview');
const updateCoverBtn = document.querySelector('button#updateCoverBtn');

// collect avatar for store

updateCoverInput.addEventListener('change', function () {
  // console.log(this.files[0]);
  const files = this.files;
  if (files.length) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(
          files[0].type
        )
      ) {
        alert('Only jpg, png, jpeg, and svg image files are allowed');
        return;
      }
      // for preview avatar
      coverPreview.src = reader.result;
      // avatarPreview.src = e.target.result;

      cropper = new Cropper(coverPreview, {
        aspectRatio: 16 / 9,
        background: false,
      });
    };
    reader.readAsDataURL(files[0]);
  } else {
    console.log('Cover photo not found!');
  }
});

// save cover photo
updateCoverBtn.addEventListener('click', function (e) {
  const canvas = cropper?.getCroppedCanvas();
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateCoverInput?.files[0]?.name || 'avatar.png';
      const formData = new FormData();
      formData.append('coverPhoto', blob, fileName);
      const url = `${window.location.origin}/profile/cover`;
      fetch(url, {
        method: 'PUT',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    alert('Please select an image to load');
  }
});
