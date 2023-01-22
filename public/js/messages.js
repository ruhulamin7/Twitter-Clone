const chatContainer = document.querySelector('.chat_container');
const url = `${location.origin}/chat`;

try {
  chatContainer.innerHTML = `
          <div class="text-center mt-5">
              <div class="spinner-border text-info text-center" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
          </div>
        `;
  fetch(url)
    .then((response) => response.json())
    .then((chatData) => {
      if (chatData.length) {
        chatContainer.innerHTML = '';
        chatData.forEach((chat) => {
          const chatItem = createChatItem(chat);
          chatContainer.appendChild(chatItem);
        });
      } else {
        chatContainer.innerHTML = `<h4 class="nothing text-center mt-5">No Chats found!</h4>`;
      }
    });
} catch (error) {
  console.log(error);
}

// display chat details
function createChatItem(chatData) {
  // get chat room users expect login user
  const otherUsers = chatData?.users?.filter((u) => u._id !== user._id);
  // get chat room's name
  let chatName = chatData.chatName;
  chatName = chatName ? chatName : getChatName(otherUsers);
  // get chat room's image
  let chatImage = chatData.chatImage;

  chatImage = chatImage
    ? `<img src ='/uploads/chats/${chatImage}'></img>`
    : otherUsers.length === 1
    ? `<img src ='${
        otherUsers[0].userAvatar
          ? '/uploads/' +
            otherUsers[0]._id +
            '/profile/' +
            otherUsers[0].userAvatar
          : '/uploads/profile/avatar.png'
      }'>`
    : `<img class="" src ='${
        otherUsers[0].userAvatar
          ? '/uploads/' +
            otherUsers[0]._id +
            '/profile/' +
            otherUsers[0].userAvatar
          : '/uploads/profile/avatar.png'
      }'>
      <img class="other_image" src ='${
        otherUsers[otherUsers.length - 1].userAvatar
          ? '/uploads/' +
            otherUsers[otherUsers.length - 1]._id +
            '/profile/' +
            otherUsers[otherUsers.length - 1].userAvatar
          : '/uploads/profile/avatar.png'
      }'>
      `;

  let latestMessage = chatData.latestMessage
    ? `<div class="sub_text">
    <p >${latestMessage?.content}</p>
    <span class="time">17:23PM</span>
    </div>`
    : `<div class="sub_text">
    <p>No messaging yet</p>
    <span class="time"></span>
    </div>`;

  let isActive = otherUsers.some((member) => member.activeStatus);
  let isGroupChat = chatData.isGroupChat;

  let activeText;
  console.log(activeText);
  if (!isGroupChat) {
    activeText = isActive
      ? 'Active Now'
      : new Date(otherUsers[0]?.lastSeen)?.toString() !== 'Invalid Date'
      ? 'Last Seen: ' + new Date(otherUsers[0]?.lastSeen)?.toDateString()
      : 'Not Recently Seen';
  } else {
    activeText = isActive ? 'Active Now' : 'Away';
  }

  const a = document.createElement('a');
  a.href = `/messages/${chatData._id}`;

  a.innerHTML = `
  <div class="chat_item">
    <div class="chat_image ${otherUsers.length > 1 && 'group_chat_image'}">
    <div data-active_status=${activeText} class="active_status tweet_active_status ${
    isActive && 'online'
  }"></div>
  ${chatImage}
    </div>
    <div class="chat_details">
    <p class='title'>${chatName}</p>
${latestMessage}
    </div>
    </div>
  `;

  return a;
}
