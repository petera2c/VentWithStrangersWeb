export const removeFile = (
  currentFiles,
  filesToDelete,
  handleParentChange,
  index
) => {
  const parentStateChangeObject = {};

  // Only add if it is in cloudinary already.If url is null it is not in the database yet
  if (currentFiles[index].url !== undefined) {
    filesToDelete.push(currentFiles[index]);
    parentStateChangeObject.filesToDelete = filesToDelete;
  }
  // Remove image from current images
  currentFiles.splice(index, 1);

  // Update parent state
  parentStateChangeObject.currentFiles = currentFiles;
  parentStateChangeObject.somethingChanged = true;
  handleParentChange(parentStateChangeObject);
};

export const showFiles = (
  event,
  currentFiles,
  fileLimit,
  callback,
  imageOnly
) => {
  let newFiles = event.target.files;

  // Check to make sure there are not more than the fileLimit
  if (newFiles.length + currentFiles.length > fileLimit) {
    return alert(
      "You have selected more than " + fileLimit + " files! Please try again"
    );
  }
  for (let index in currentFiles) {
    if (isVideo(currentFiles[index])) {
      return alert(
        "You can't upload anymore because you have already uploaded a video"
      );
    }
  }

  for (let index in newFiles) {
    if (isNaN(index)) continue;
    if (isVideo(newFiles[index]) && newFiles.length > 1) {
      return alert(
        "You can't upload any photos with a video and you can only upload 1 video max with a post."
      );
    }
  }
  if (currentFiles.length > 0 && isVideo(newFiles[0])) {
    return alert(
      "You can't upload any photos with a video and you can only upload 1 video max with a post."
    );
  }

  // Check to make sure each file is under 5MB
  for (let index = 0; index < newFiles.length; index++) {
    let fileToCheck = newFiles[index];
    if (!isImage(fileToCheck) && imageOnly) {
      return alert("This file is not an image.");
    }
    if (isFileOverSize(fileToCheck)) {
      return true;
      /*alert(
        "Please contact peterm@ghostit.co for technical support. We do not currently support this file format, but we may do a software update if you contact us."
      );*/
    }
  }

  setFilesToParentState(newFiles, currentFiles, callback);
};

export const setFilesToParentState = (newFiles, currentFiles, callback) => {
  // Save each file to state
  for (let index = 0; index < newFiles.length; index++) {
    let reader = new FileReader();
    let file = newFiles[index];
    reader.onloadend = file => {
      currentFiles.push({
        file: reader.result,
        type: getFileType(file)
      });

      callback({ files: currentFiles, somethingChanged: true });
    };
    reader.readAsDataURL(file);
  }
};

const isFileOverSize = fileToCheck => {
  if (isImage(fileToCheck)) {
    if (fileToCheck.size > 5000000) {
      alert("File size on one or more photos is over 5MB.");
      return true;
    }
  } else if (isVideo(fileToCheck)) {
    //  if (fileToCheck.size > 1750000000) {
    if (fileToCheck.size > 10000000) {
      alert("File size on one or more videos is over 10MB.");
      return true;
    }
  } /*else if (isGif(fileToCheck)) {
    if (fileToCheck.size > 5000000) {
      alert("File size on one or more gifs is over 5MB.");
      return true;
    }
  }*/ else
    return false;
};

export const isImage = fileToCheck => {
  const fileExtension = getFileExtension(fileToCheck);
  return fileExtension.match(
    /(\.|\/)(jpe?g|ico|png|svg|woff|ttf|wav|mp3)($|;)/i
  );
};

export const isVideo = fileToCheck => {
  const fileExtension = String(getFileExtension(fileToCheck));
  return (
    fileExtension.match(/(\.|\/)(avi|flv|wmv|mov|mp4|video)($|;)/i) ||
    fileExtension.substring(0, 10) === "data:video"
  );
};

export const isGif = fileToCheck => {
  const fileExtension = getFileExtension(fileToCheck);
  return fileExtension.match(/(\.|\/)(gif)($|;)/i);
};
export const getFileType = file => {
  if (isImage(file)) return "image";
  else if (isVideo(file)) return "video";
  else if (isGif(file)) return "gif";
  else {
    return alert(
      "Error cannot read file extension, please contact peterm@ghostit.co"
    );
  }
};
const getFileExtension = file => {
  if (file.name) return file.name;
  else if (file.file) return file.file;
  else if (file.url) return file.url;
  else if (file.currentTarget) return file.currentTarget.result;
  else {
    return alert(
      "Error cannot read file extension, please contact peterm@ghostit.co"
    );
  }
};
