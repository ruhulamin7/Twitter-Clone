// select elements
const tweetInputEl = document.querySelector('textarea#create_tweet');
const tweetBtn = document.querySelector('button#tweet_btn');

const tweetImgInputEl = document.querySelector('#tweet_img');
const outputImageContainer = document.querySelector('.output_image_container');
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

// // handle image upload
// tweetImgInputEl.addEventListener('change', function (e) {
//   const files = this.files;
//   [...files].map((file) => {
//     const imgTag = document.createElement('img');
//     imgTag.src = URL.createObjectURL(file);
//     imgTag.style.width = '200px';
//     imgTag.style.marginRight = '10px';
//     imgTag.style.marginBottom = '10px';
//     outputImageContainer.appendChild(imgTag);
//     imgTag.addEventListener('click', function () {
//       this.remove();
//     });
//   });
// });

// handle image upload
tweetImgInputEl.addEventListener('change', function (e) {
  const files = this.files;
  if (files.length) {
    [...files].forEach((file) => {
      const fr = new FileReader();
      fr.onload = function () {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          alert('Only image files are allowed');
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
