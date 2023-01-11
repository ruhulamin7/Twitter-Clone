const following = (profileUser && profileUser.following) || [];
const followers = (profileUser && profileUser.followers) || [];

const followListContainer = document.querySelector('.follow_list_container');

if (tab === 'following') {
  following.forEach((followingUser) => {
    const html = createFollowingElement(followingUser);
    followListContainer.appendChild(html);
  });
} else {
  followers.forEach((follower) => {
    const html = createFollowingElement(follower);
    followListContainer.appendChild(html);
  });
}
