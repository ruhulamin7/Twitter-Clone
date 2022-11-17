// select elements
const tweetInputEl = document.querySelector('textarea#create_tweet');
const tweetBtn = document.querySelector('button#tweet_btn');

const tweetImgInputEl = document.querySelector('#tweet_img');
const outputImageContainer = document.querySelector(
  '.output_image_inner_container'
);
const postImages = [];

// tweet button disable/enable function
tweetInputEl.addEventListener('input', function (e) {
  const value = this.value.trim();
  if (value || postImages.length) {
    tweetBtn.removeAttribute('disabled');
    tweetBtn.classList.remove('dis_btn');
  } else {
    tweetBtn.setAttribute('disabled', true);
    tweetBtn.classList.add('dis_btn');
  }
});

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
        postImages.push(file);
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
    postImages.forEach((img, i) => {
      if (img.name === fileName) {
        postImages.splice(i, 1);
        imgEl.remove();
        if (!postImages.length && !tweetInputEl.value.trim()) {
          tweetBtn.setAttribute('disabled', true);
          tweetBtn.classList.add('dis_btn');
        }
      }
    });
  }
});

// post the tweet
tweetBtn.addEventListener('click', function () {
  const content = tweetInputEl.value;
  if (!(postImages.length || content)) return;

  const formData = new FormData();
  formData.append('content', content);
  postImages.forEach((file) => {
    formData.append(file.name, file);
  });

  // const url = window.location.protocol + '//' + window.location.host;
  const url = `${window.location.origin}/tweet`;
  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
    });
});
