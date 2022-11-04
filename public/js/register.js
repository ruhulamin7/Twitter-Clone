// select elements
const passwordEl = document.querySelector('#password');
const passwordEyeIcon = document.querySelector('#passwordEyeIcon');
const confirmPasswordEl = document.querySelector('#confirmPassword');
const confirmPasswordEyeIcon = document.querySelector(
  '#confirmPasswordEyeIcon'
);

// password hide and show handler
function passwordHideAndShow(icon, field) {
  icon.addEventListener('click', function (e) {
    if (icon.className === 'fa-regular fa-eye') {
      icon.className = 'fa-regular fa-eye-slash';
      field.type = 'text';
    } else {
      icon.className = 'fa-regular fa-eye';
      field.type = 'password';
    }
  });
}

// password handler
passwordHideAndShow(passwordEyeIcon, passwordEl);
// confirm password handler
passwordHideAndShow(confirmPasswordEyeIcon, confirmPasswordEl);
