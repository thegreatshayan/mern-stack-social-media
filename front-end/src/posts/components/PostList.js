import PostItem from "./PostItem";
import "./PostList.css";

const PostList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <h2>پستی پیدا نشد.</h2>
      </div>
    );
  }
  return (
    <div className="post main center">
      <ul>
        {props.items.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            image={post.image}
            title={post.title}
            description={post.description}
            creatorId={post.creator}
            onDelete={props.onDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default PostList;
