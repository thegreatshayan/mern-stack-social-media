import { useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { validatorRequire } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const { sendRequest } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();

        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          "users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }

    console.log(formState.inputs);
  };

  return (
    <div className="main center auth">
      <h2>ورود و ثبت نام</h2>
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            id="name"
            type="text"
            element="input"
            placeholder="نام"
            validators={[validatorRequire()]}
            onInput={inputHandler}
            errorText="لطفا نام معتبر وارد کنید."
          />
        )}
        {!isLoginMode && <ImageUpload id="image" onInput={inputHandler} />}
        <Input
          id="email"
          type="email"
          element="input"
          placeholder="ایمیل"
          validators={[validatorRequire()]}
          onInput={inputHandler}
          errorText="لطفا ایمیل معتبر وارد کنید."
        />
        <Input
          id="password"
          type="password"
          element="input"
          placeholder="رمز عبور"
          validators={[validatorRequire()]}
          onInput={inputHandler}
          errorText="لطفا رمز عبور معتبر وارد کنید."
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "ورود" : "ثبت نام"}
        </Button>
      </form>
      <Button onclick={switchModeHandler}>
        تغییر به {isLoginMode ? "ثبت نام" : "ورود"}
      </Button>
    </div>
  );
};

export default Auth;
