// select elements
const passwordEl = document.querySelector('#password');
const passwordEyeIcon = document.querySelector('#passwordEyeIcon');
const confirmPasswordEl = document.querySelector('#confirmPassword');
const confirmPasswordEyeIcon = document.querySelector(
  '#confirmPasswordEyeIcon'
);

const usernameEl = document.getElementById('username');
const usernameErrorEl = document.getElementById('username_error');
const emailEl = document.getElementById('email');
const emailErrorEl = document.getElementById('email_error');

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

// realtime password validation handler
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

// check realtime password
function checkPassword(pass) {
  let validationResult = passwordValidator(pass);
  if (validationResult.length > 0) {
    let errorMsg =
      'Your password must contain at least ' + validationResult.join(', ');
    confirmPassErrorsEl.hidden = true;
    passErrorsEl.hidden = false;
    // document.getElementById('pass_err').hidden = true;
    // document.getElementById('confirm_pass_err').hidden = true;
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

// key down clear timer
passwordEl.addEventListener('keydown', function () {
  clearTimeout(typingTimer);
});

// key down clear timer
confirmPasswordEl.addEventListener('keydown', function () {
  clearTimeout(typingTimer);
});

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

// username realtime validation
let userName;
const usernameValidator = (username) => {
  try {
    fetch(`http://localhost:3000/username/${username}`)
      .then((res) => res.json())
      .then((data) => {
        userName = data[0];
        if (!username) {
          usernameErrorEl.hidden = true;
          return;
        }
        if (username?.length < 3) {
          usernameErrorEl.hidden = false;
          usernameErrorEl.innerText =
            'Username should be at least 3 characters';
          // document.getElementById('username_err').hidden = true;
          return;
        }
        if (userName?.username) {
          usernameErrorEl.hidden = false;
          usernameErrorEl.innerText = 'Username is already taken';
          // document.getElementById('username_err').hidden = true;
        } else {
          usernameErrorEl.hidden = true;
        }
      });
  } catch (error) {
    console.log(error);
  }
};

// username realtime validation
let userEmail;
const emailValidator = (email) => {
  try {
    fetch(`http://localhost:3000/email/${email}`)
      .then((res) => res.json())
      .then((data) => {
        userEmail = data[0];
        if (!email) {
          emailErrorEl.hidden = true;
          return;
        }
        if (userEmail?.email) {
          emailErrorEl.hidden = false;
          emailErrorEl.innerText = 'Email is already in use';
        } else {
          emailErrorEl.hidden = true;
        }
      });
  } catch (error) {
    console.log(error);
  }
};

// username validation
usernameEl.addEventListener('keyup', function () {
  usernameErrorEl.hidden = true;
  const username = usernameEl.value.trim();
  setTimeout(() => {
    usernameValidator(username);
  }, 500);
});

// email validation
emailEl.addEventListener('keyup', function () {
  const email = emailEl.value.trim();
  emailErrorEl.hidden = true;
  setTimeout(() => {
    emailValidator(email);
  }, 500);
});
