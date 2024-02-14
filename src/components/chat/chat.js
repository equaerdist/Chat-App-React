import background from "../../img/background.png";
import cat from "../../img/cat.jpg";
import { Divider, Avatar } from "@mui/material";
import stringAvatar from "../../functions/stringAvatar";
import { useEffect, useMemo } from "react";
const Chat = (props) => {
  useEffect(() => {
    props.chatRef.current.scrollTo({
      top: props.chatRef.current.scrollHeight,
      behavior: "smooth",
    });
    props.chatRef.current.addEventListener("scroll", props.onScroll);
    return () =>
      props.chatRef.current.removeEventListener("scroll", props.onScroll);
  }, []);
  return (
    <div className="main__chat" ref={props.chatRef}>
      {props.children}
      {props.messages.map((item) => {
        return <ChatItem {...item} key={item.id}></ChatItem>;
      })}
    </div>
  );
};
const ChatItem = (props) => {
  let avatarStyle = useMemo(() => {
    if (props.creator.thumbnail.indexOf("user") !== -1)
      return stringAvatar(props.creator.fullName);
    return { src: props.creator.thumbnail };
  }, [props.creator.thumbnail]);
  return (
    <div className="main__chat-item" key={props.id}>
      <Avatar {...avatarStyle} />
      <div className="main__chat-content">
        <div className="main__chat-title">
          <div className="main__chat-name">{props.creator.fullName}</div>
          <div className="main__chat-date">{props.createDate}</div>
        </div>
        <div className="main__chat-text">{props.text}</div>
      </div>
    </div>
  );
};
export default Chat;
