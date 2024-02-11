import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/FormElements/input";
import { validatorRequire } from "../../shared/util/validator";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./NewPost.css";

const NewPost = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const { sendRequest } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const postSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);

      await sendRequest("posts", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="center main post">
      <form onSubmit={postSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          placeholder="عنوان"
          errorText="لطفا عنوان معتبر وارد کنید."
          validators={[validatorRequire()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          placeholder="توضیح"
          errorText="لطفا توضیح معتبر وارد کنید."
          validators={[validatorRequire()]}
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          افزودن
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
