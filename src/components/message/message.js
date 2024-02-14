const Message = (props) => {
  return (
    <div className="main__message">
      <img src="png/Iconscrap.png" alt="" /> <span className="icon-mic"></span>
      <textarea
        onKeyDown={(e) => {
          if (e.code == "Enter") {
            props.onSubmit();
          }
        }}
        placeholder="Начните общение"
        name="message"
        onInput={(e) => props.onInput(e.target.value)}
        value={props.value}
        className="main__message-text"
      ></textarea>
      <span className="icon-grinning-face fz-28"></span>
    </div>
  );
};
export default Message;
