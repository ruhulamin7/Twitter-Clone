const chatHeader = document.querySelector('.chat_header');
const chatImage = document.querySelector('.chat_image');
const chatName = document.querySelector('.chat_name');

const url = `${location.origin}/chat/${chatId}`;

try {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data._id) {
        return (chatHeader.innerHTML = `<h4>${data.error}</h4>`);
      }
      console.log(data);
    });
} catch (error) {
  console.log(error);
}

// auto height textarea
function auto_grow(element) {
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
}
