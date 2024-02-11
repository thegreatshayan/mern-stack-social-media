import UserItem from "./UserItem";
import "./UsersList.css";

const UsersList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="main center">
        <h2>کاربری وجود ندارد.</h2>
      </div>
    );
  }

  return (
    <div className="main center">
      <ul>
        {items.map((user) => (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            postCount={user.posts.length}
          />
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
