import { useEffect, useMemo, useRef, useState } from "react";
import Api from "../../services/Api";
import CircularProgress from "@mui/material/CircularProgress";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import GroupForm from "../createGroupForm/GroupForm";
import { Alert } from "@mui/material";
const TabPanel = (props) => {
  const refs = useRef([]);
  const setRef = (ref, index) => {
    if (ref) refs.current[index] = ref;
  };
  const [error, setError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const onSwitch = (index) => {
    refs.current.forEach((item, i) => {
      if (item) {
        if (i !== index) item.classList.remove("main__tag_active");
        else item.classList.add("main__tag_active");
      }
    });
  };
  const [availableChats, setAvailableChats] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [openModal, setOpenModal] = useState(false);
  const api = useMemo(() => new Api(), []);
  const onClick = (e) => {
    setOpenModal(true);
  };
  useEffect(() => {
    api
      .getGroupsForUser(props.userId, pageSize, 1)
      .then((g) => {
        setAvailableChats(g);
      })
      .catch((e) => console.log(e));
  }, [props.newChat, props.userId]);
  return (
    <div className="main__navigation">
      <GroupForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        setGroups={setAvailableChats}
        setError={setError}
        setMessage={setModalMessage}
      ></GroupForm>
      <div className="main__first-stroke">
        <div className="main__navigation-dropbox">
          <div className="main__navigation-title">Табы</div>
        </div>
        <div className="main__settings">
          <span className="icon-settings"></span>
        </div>
      </div>
      <div className="main__treads">
        <span className="icon-bubble"></span>
      </div>
      <div className="main__channels">
        <div className="main__channels-stroke">
          <div className="main__channels-title">Чаты</div>
          <div className="main__channels-counter">{availableChats.length}</div>
          <AddToPhotosIcon
            onClick={onClick}
            sx={{ color: "white", marginLeft: "15px", cursor: "pointer" }}
          ></AddToPhotosIcon>
        </div>
        <ul className="main__channels-list">
          {availableChats.map((item, index) => (
            <TabItem
              key={item.id}
              {...item}
              setChat={props.setChat}
              setRef={(elem) => setRef(elem, index)}
              onSwitch={() => onSwitch(index)}
            ></TabItem>
          ))}
          {!props.userId ? (
            <CircularProgress sx={{ display: "block", marginInline: "auto" }} />
          ) : null}
          {error ? <Alert severity="error">{modalMessage}</Alert> : null}
        </ul>
      </div>
    </div>
  );
};
const TabItem = (props) => {
  return (
    <li className="main__tag" key={props.id} ref={props.setRef}>
      <button
        onClick={() => {
          props.onSwitch();
          props.setChat(props.id);
        }}
        className="main__tag-button"
      >
        {props.name}
      </button>
    </li>
  );
};
export default TabPanel;
