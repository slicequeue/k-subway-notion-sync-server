
function tic() {
  return (new Date()).getTime();
}

function toc(msec) {
  return (new Date()).getTime() - msec;
}

async function sleep(msec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('sleep:', msec);
      resolve();
    }, msec);
  });
}

module.exports = {
  sleep,
  tic, toc
}
