const searchField = document.querySelector('#user_search');
const userContainer = document.querySelector('.follow_list_container');
const createChatBtn = document.querySelector('#create_chat_btn');
const selectedUsersContainer = document.querySelector('#selected_users');

let timer;
let selectedUsers = [];

userContainer.innerHTML = `     
            <h5 class="nothing text-center mt-5"> Please, search with a keyword. <i class="fab fa-searchengin"></i></h5> 
            `;

searchField.addEventListener('input', function (e) {
  clearTimeout(timer);
  const searchText = e.target.value.trim();
  if (searchText) {
    timer = setTimeout(function () {
      const url = `${window.location.origin}/users?searchText=${searchText}`;
      userContainer.innerHTML = `
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
            userContainer.innerHTML = '';
            // check user is already selected or not
            const notSelectedUsers = data.filter((dt) => {
              if (
                selectedUsers.some((su) => su._id === dt._id) ||
                dt._id === user._id
              ) {
                return false;
              } else {
                return true;
              }
            });

            if (!notSelectedUsers.length) {
              return (userContainer.innerHTML = `<h5 class="nothing text-center mt-5">Oops! No users found!! 😞</h5>`);
            } else {
              notSelectedUsers.forEach((userData) => {
                const userEl = createFollowingElement(userData, true);
                userEl.addEventListener('click', function () {
                  selectedUsers.push(userData);
                  searchField.value = '';
                  searchField.focus();
                  userContainer.innerHTML = '';
                  displaySelectedUsers(selectedUsers);
                });
                userContainer.appendChild(userEl);
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
    }, 500);
  } else {
    userContainer.innerHTML = `<h5 class="text-center mt-5"> Please, search with a keyword. <i class="fab fa-searchengin"></i></h5>`;
  }
});

// display selected users
function displaySelectedUsers(selectedUsers) {
  if (selectedUsers.length >= 2) {
    createChatBtn.disabled = false;
    createChatBtn.classList.remove('dis_btn');
  } else {
    createChatBtn.disabled = true;
    createChatBtn.classList.add('dis_btn');
  }
  selectedUsersContainer.innerHTML = '';
  selectedUsers.forEach((selectedUser) => {
    const fullName = selectedUser.firstName + ' ' + selectedUser.lastName;
    const avatarSrc = selectedUser.userAvatar
      ? `/uploads/${selectedUser._id}/profile/${selectedUser.userAvatar}`
      : `/uploads/profile/avatar.png`;

    const div = document.createElement('div');
    div.classList.add('selected_user');

    div.innerHTML = `
    <img src = ${avatarSrc}>
    <span>${fullName}</span>
    <button onclick="disSelectUser(event, '${selectedUser._id}')">
        <i class="fas fa-times"></i>
    </button>
    `;
    selectedUsersContainer.appendChild(div);
  });
}

// disSelect users
function disSelectUser(event, userId) {
  selectedUsers = selectedUsers.filter((selectedUser) => {
    return selectedUser._id !== userId;
  });
  selectedUsersContainer.innerHTML = '';
  displaySelectedUsers(selectedUsers);
  searchField.focus();
}

createChatBtn.addEventListener('click', function (e) {
  const url = `${window.location.origin}/chat`;
  try {
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(selectedUsers),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data._id) {
          location.href = `${window.location.origin}/messages/${data._id}`;
        } else {
          alert('Something went wrong!');
        }
      });
  } catch (error) {
    next(error);
  }
});
