import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import PostList from "../components/PostList";

const UserPosts = () => {
  const [loadedPosts, setLoadedPosts] = useState();

  const { sendRequest } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(`posts/user/${userId}`);

        setLoadedPosts(responseData.posts);
      } catch (err) {}
    };

    fetchPosts();
  }, [sendRequest, userId, loadedPosts]);

  const deleteHandler = (postId) => {
    setLoadedPosts((prevPosts) => {
      prevPosts.filter((post) => post.id !== postId);
    });
  };

  return (
    <>
      {loadedPosts && <PostList items={loadedPosts} onDelete={deleteHandler} />}
    </>
  );
};

export default UserPosts;
