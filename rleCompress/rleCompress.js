function format(arr) {
    return arr.map(x => `(${x.char}, ${x.cnt})`).join("");
  }

function rleCompress(str) {
    let rleArr = [];
  
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== str[i - 1]) {
        rleArr.push({ char: str[i], cnt: 1 });
      } else {
        rleArr[rleArr.length - 1].cnt++;
      }
    }
    return format(rleArr) ;
  }