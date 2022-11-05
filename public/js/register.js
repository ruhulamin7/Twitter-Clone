// select elements
const passwordEl = document.querySelector('#password');
const passwordEyeIcon = document.querySelector('#passwordEyeIcon');
const confirmPasswordEl = document.querySelector('#confirmPassword');
const confirmPasswordEyeIcon = document.querySelector(
  '#confirmPasswordEyeIcon'
);

let passErrorsEl = document.querySelector('#passErrors');
passErrorsEl.hidden = true;
let confirmPassErrorsEl = document.querySelector('#confirmPassErrors');
confirmPassErrorsEl.hidden = true;

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

// password validation handler
function passwordValidator(pass) {
  let errors = [];
  if (pass.length < 8) {
    errors.push('8 characters');
  }
  if (pass.search(/[a-z]/) < 0) {
    errors.push('1 lowercase letter');
  }
  if (pass.search(/[A-Z]/) < 0) {
    errors.push('1 uppercase letter');
  }
  if (pass.search(/[0-9]/) < 0) {
    errors.push('1 digit');
  }
  if (pass.search(/[\!\@\#\$\%\^\&\*\(\)\_\+\,\;\:\-]/) < 0) {
    errors.push('1 special character.');
  }
  return errors;
}

// check password
function checkPassword(pass) {
  let validationResult = passwordValidator(pass);
  if (validationResult.length > 0) {
    let errorMsg =
      'Your password must contain at least ' + validationResult.join(', ');
    confirmPassErrorsEl.hidden = true;
    passErrorsEl.hidden = false;
    passErrorsEl.textContent = errorMsg;
  }
}

// key press timer
let typingTimer;
passwordEl.addEventListener('keyup', function () {
  const passInput = passwordEl.value;
  clearTimeout(typingTimer);
  passErrorsEl.hidden = true;

  if (passInput) {
    typingTimer = setTimeout(() => {
      checkPassword(passInput);
    }, 500);
  }
});

// key down clear timer
// passwordEl.addEventListener('keydown', function () {
//   clearTimeout(typingTimer);
// });

// check confirm password
function checkConfirmPassword() {
  if (passwordEl.value !== confirmPasswordEl.value) {
    confirmPassErrorsEl.textContent = "Password does't match";
    confirmPassErrorsEl.hidden = false;
    passErrorsEl.hidden = true;
  } else {
    passErrorsEl.hidden = true;
    confirmPassErrorsEl.hidden = true;
  }
}

// confirm password match validation
confirmPasswordEl.addEventListener('keyup', function () {
  clearTimeout(typingTimer);

  if (confirmPasswordEl.value) {
    typingTimer = setTimeout(() => {
      checkConfirmPassword();
    }, 500);
  } else {
    confirmPassErrorsEl.hidden = true;
  }
});

// key down clear timer
// confirmPasswordEl.addEventListener('keydown', function () {
//   clearTimeout(typingTimer);
// });
