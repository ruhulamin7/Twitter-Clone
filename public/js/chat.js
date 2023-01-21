const chatHeader = document.querySelector('.chat_header');
const chatImageEl = document.querySelector('.chat_image');
const chatNameEl = document.querySelector('.chat_name');

try {
  const url = `${location.origin}/chat/${chatId}`;
  fetch(url)
    .then((res) => res.json())
    .then((chatData) => {
      if (!chatData._id) {
        return (chatHeader.innerHTML = `<h4>${chatData.error}</h4>`);
      }
      displayChatDetails(chatData);
    });
} catch (error) {}

// display chat details
function displayChatDetails(chatData) {
  // get chat room users expect login user
  const otherUsers = chatData?.users?.filter((u) => u._id !== user._id);
  // get chat room's name
  let chatName = chatData.chatName;
  chatName = chatName ? chatName : getChatName(otherUsers);
  // get chat room's image
  let chatImage = chatData.chatImage;
  let remainingUsers =
    otherUsers.length <= 2
      ? ''
      : `<span class="remainingUsers other_image"">+${
          otherUsers.length - 2
        }</span>`;

  chatImage = chatImage
    ? `<img src = '/uploads/chats/${chatImage}'></img>`
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
      }'>${remainingUsers}
      `;

  chatImageEl.innerHTML = chatImage;
  chatNameEl.innerHTML = `<h6>${chatName}</h6>`;
}

// auto height textarea
function auto_grow(element) {
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
}
