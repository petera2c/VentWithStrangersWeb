const isUrlImage = url => {
  return url.match(/image/);
};
const isUrlVideo = url => {
  return url.match(/video/);
};

const isUrlGif = url => {
  return url.match(/gif/);
};
const whatFileTypeIsString = url => {
  if (isUrlImage(url)) return "image";
  else if (isUrlVideo(url)) return "video";
  else if (isUrlGif(url)) return "raw";
  else return "raw";
};

module.exports = {
  whatFileTypeIsString,
  handleError: (res, err, object, message) => {
    if (object) {
      console.log(object);
    }
    let error = err;
    if (message) error = message;

    console.log(err);
    console.log(message);
    if (res) res.send({ success: false, message: error });
    return false;
  }
};
