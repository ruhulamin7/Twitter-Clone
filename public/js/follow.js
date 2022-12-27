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
        if (userProfile._id === user._id) {
          following.textContent = parseInt(following.textContent) + 1;
        }
        followBtn.textContent = 'Following';
        followBtn.classList.add('following_btn');
      } else {
        if (userProfile._id === user._id) {
          following.textContent = parseInt(following.textContent) - 1;
        }
        followBtn.textContent = 'Follow';
        followBtn.classList.remove('following_btn');
      }

      if (data._id === userProfile._id) {
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }
    });
}

const following = (userProfile && userProfile.following) || [];
const followers = (userProfile && userProfile.followers) || [];

const followContainer = document.querySelector('.follow_list_container');

if (tab === 'following') {
  following.forEach((followingUser) => {
    const html = createFollowingElement(followingUser);
    followContainer.appendChild(html);
  });
} else {
  followers.forEach((follower) => {
    const html = createFollowingElement(follower);
    followContainer.appendChild(html);
  });
}

function createFollowingElement(data) {
  const name = data.firstName + ' ' + data.lastName;
  const isFollowing = data?.following?.includes(user._id);

  let followDiv = '';
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
      <div class="avatar">
        <img src="/uploads/profile/${data.userAvatar}">
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
