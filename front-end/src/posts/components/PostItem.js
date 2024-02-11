import { useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PostItem = (props) => {
  const auth = useContext(AuthContext);

  const { sendRequest } = useHttpClient();

  const deleteHandler = async () => {
    try {
      await sendRequest(`posts/${props.id}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });

      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li>
      <div>
        <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
      </div>
      <div>
        <h2>{props.title}</h2>
        <h3>{props.description}</h3>
      </div>
      <div>
        {auth.isLoggedIn && props.creatorId === auth.userId && (
          <Button onclick={deleteHandler}>حذف</Button>
        )}
      </div>
    </li>
  );
};

export default PostItem;
