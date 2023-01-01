let passwordEl = document.getElementById('password');
let passEyeIcon = document.getElementById('passEyeIcon');

// password hide and show
passEyeIcon.addEventListener('click', function (e) {
  if (passEyeIcon.className === 'fas fa-eye') {
    passEyeIcon.className = 'fas fas fa-eye-slash';
    passwordEl.type = 'text';
  } else {
    passEyeIcon.className = 'fas fa-eye';
    passwordEl.type = 'password';
  }
});
