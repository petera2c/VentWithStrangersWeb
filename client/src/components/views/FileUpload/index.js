import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import GIContainer from "../../containers/GIContainer";

import { isImage, isVideo, showFiles, removeFile } from "./util";
import "./style.css";

class FileUpload extends Component {
  render() {
    const { handleParentChange } = this.props; // Functions
    const {
      className = "br8",
      canEdit = true,
      currentFiles = [],
      fileIcon = faPlus,
      fileLimit = 4,
      filesToDelete = [],
      hideUploadButton = false,
      id = String(Math.random()),
      imageClassName,
      imageContainerClassName,
      imageOnly,
      testMode
    } = this.props; // Variables

    return (
      <GIContainer className="align-center wrap x-fill" testMode={testMode}>
        {!hideUploadButton && currentFiles.length < fileLimit && canEdit && (
          <GIContainer className={className}>
            <label
              htmlFor={id}
              className="br4 shadow-blue-4 bg-blue-fade-4 white xy-64px clickable full-center flex"
            >
              <FontAwesomeIcon icon={fileIcon} size="2x" />
            </label>

            <input
              id={id}
              type="file"
              onChange={event =>
                showFiles(
                  event,
                  currentFiles,
                  fileLimit,
                  handleParentChange,
                  imageOnly
                )
              }
              multiple
            />
          </GIContainer>
        )}
        <GIContainer className="fill-flex justify-end">
          {currentFiles.map((file, index) => {
            return (
              <GIContainer
                className={`relative uploaded-file ${imageContainerClassName} ma2`}
                key={index}
              >
                {isImage(file) && (
                  <img
                    alt="error"
                    className={imageClassName}
                    src={file.file ? file.file : file.url}
                  />
                )}
                {isVideo(file) && (
                  <video
                    alt="error"
                    className={imageClassName}
                    src={file.file ? file.file : file.url}
                  />
                )}
                {canEdit && (
                  <FontAwesomeIcon
                    className="bg-white primary-font shadow-left icon-x-hover round-icon-small small clickable round"
                    icon={faTimes}
                    onClick={() =>
                      removeFile(
                        currentFiles,
                        filesToDelete,
                        handleParentChange,
                        index
                      )
                    }
                  />
                )}
              </GIContainer>
            );
          })}
        </GIContainer>
      </GIContainer>
    );
  }
}

export default FileUpload;
