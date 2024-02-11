import { useRef, useState, useEffect } from "react";

import Button from "./Button";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [isValid, setIsValid] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setpreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      setFile(pickedFile);

      setIsValid(true);

      fileIsValid = true;
    } else {
      setIsValid(false);

      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="image-upload">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="container">
        <div className="image-upload-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" />
          ) : (
            <p>لطفا یک تصویر انتخاب کنید</p>
          )}
        </div>
        <Button type="button" onclick={pickImageHandler}>
          انتخاب تصویر
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
