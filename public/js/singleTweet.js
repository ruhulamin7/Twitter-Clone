// show tweets to UI
async function loadTweets() {
  try {
    const result = await fetch(
      `${window.location.origin}/tweets/single/${tweetId}`
    );
    const tweet = await result.json();

    if (tweet === null) {
      return (location.href = '/');
    }

    const tweetEl = createTweet(tweet);
    tweetContainer.appendChild(tweetEl);

    tweet.repliedTweets.forEach(async (tweetId) => {
      const result = await fetch(
        `${window.location.origin}/tweets/single/${tweetId}`
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
