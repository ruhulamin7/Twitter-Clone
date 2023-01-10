const searchField = document.querySelector('.search_input');
const tweetContainer = document.querySelector('.tweet_container');
const userContainer = document.querySelector('.follow_list_container');

tweetContainer.innerHTML = `
           
            <h5 class="nothing text-center mt-5"> Please, search with a keyword. <i class="fab fa-searchengin"></i></h5> 
            `;
let timer;

searchField.addEventListener('input', function (e) {
  clearTimeout(timer);
  const searchText = e.target.value.trim();
  if (searchText) {
    timer = setTimeout(function () {
      const url = `${window.location.origin}/${tab}?searchText=${searchText}`;
      tweetContainer.innerHTML = `
        <div class="text-center mt-5">
            <div class="spinner-border text-info text-center" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
      `;
      try {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            tweetContainer.innerHTML = '';
            userContainer.innerHTML = '';
            if (tab === 'tweets') {
              if (!data.length) {
                return (tweetContainer.innerHTML = `<h5 class="nothing">Oops! No Tweet found!! :(</h5>`);
              } else {
                data.forEach((tweet) => {
                  const tweetEl = createTweet(tweet);
                  tweetContainer.insertAdjacentElement('afterbegin', tweetEl);
                });
              }
            } else {
              if (!data.length) {
                return (tweetContainer.innerHTML = `<h5 class="nothing">Oops! No user found!! :(</h5>`);
              } else {
                data.forEach((tweet) => {
                  const tweetEl = createTweet(tweet);
                  userContainer.insertAdjacentElement('afterbegin', tweetEl);
                });
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }, 500);
  }
});
