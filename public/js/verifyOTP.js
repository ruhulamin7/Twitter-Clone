const minute = document.getElementById('minute');
const second = document.getElementById('second');
let countdown = document.getElementById('countdown');
const timer = document.querySelectorAll('#countdown span');
timer.forEach((el) => {
  el.style.fontSize = '22px';
});

let min = 60;
let sec = 60;
const secTimer = setInterval(() => {
  sec--;
  second.innerText = sec.toString().length === 1 ? '0' + sec : sec;
  if (sec === 0) {
    clearInterval(secTimer);
    const minTimer = setInterval(() => {
      if (sec === 0 && min !== 0) {
        min--;
        minute.innerText = min.toString().length === 1 ? '0' + min : min;
        if (min === 0 && sec === 0) {
          clearInterval(minTimer);
          countdown.innerHTML = 'Time Expired!';
          countdown.style.color = 'red';
        }
      }
    }, 1000);
  }
}, 1000);
