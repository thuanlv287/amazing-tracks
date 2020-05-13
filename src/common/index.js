/**
 * Check empty object
 * @param {*} obj 
 */
const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

/**
 * Get random number in array
 * @param {*} arr 
 */
const getRandom = (arr) => {
  let random = 0;
  for (let i = 0; i < arr.length; i++) {
    random = Math.floor(Math.random() * arr.length) + 1;
  }
  return random;
}


// export
export {
  isEmpty,
  getRandom
}