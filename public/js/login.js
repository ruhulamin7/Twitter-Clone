let passwordEl = document.getElementById('password');
let passEyeIcon = document.getElementById('passEyeIcon');

// password hide and show
passEyeIcon.addEventListener('click', function (e) {
  if (passEyeIcon.className === 'fa-regular fa-eye') {
    passEyeIcon.className = 'fa-regular fa-eye-slash';
    passwordEl.type = 'text';
  } else {
    passEyeIcon.className = 'fa-regular fa-eye';
    passwordEl.type = 'password';
  }
});
