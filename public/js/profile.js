// select elements
let tweetContainer = document.querySelector('.tweet_container');
const replayBtn = document.querySelector('#replay_btn');
const replayText = document.querySelector('#replay_text');
const replayImgInput = document.querySelector('#replay_img');
const replayImageContainer = document.querySelector(
  '.replay_image_inner_container'
);

let replayImages = [];

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

// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(
      `${window.location.origin}/tweets?tweetedBy=${userProfile._id}&replayTo=${
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
  } catch (error) {
    console.log(error);
  }
}

// load all the tweets
loadTweets();

// following functions
function followHandler(event, userId) {
  // document.querySelector('.follow_btn)
  const followBtn = event.target;

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
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      } else {
        followBtn.textContent = 'Follow';
        followBtn.classList.remove('following_btn');
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }

      // location.reload();
    });
}

// document
//   .querySelector('.following_btn')
//   .addEventListener('mouseover', function () {
//     this.innerHTML = 'Unfollow';
//     this.style.border = '1px solid red';
//     this.style.backgroundColor = 'unset';
//     this.style.color = '#50abf1';
//   });

// document
//   .querySelector('.following_btn')
//   .addEventListener('mouseout', function () {
//     this.innerHTML = 'Following';
//     this.style.border = '1px solid #50abf1';
//     this.style.backgroundColor = '#50abf1';
//     this.style.color = 'white';
//   });
