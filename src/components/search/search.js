import Api from "../../services/Api";
import {
  TextField,
  Autocomplete,
  Typography,
  Box,
  Modal,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import stringAvatar from "../../functions/stringAvatar";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};
const Search = (props) => {
  const [group, setGroup] = useState(null);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const onInput = (e) => {
    setSearchTerm(e.target.value);
  };
  const [modal, showModal] = useState(false);
  const api = useMemo(() => new Api(), []);
  const defferedSearchQuery = useDeferredValue(searchTerm);
  useEffect(() => {
    if (defferedSearchQuery !== "" && defferedSearchQuery)
      api.getGroupForSeachAsync(defferedSearchQuery).then((e) => {
        setOptions(e);
      });
  }, [defferedSearchQuery]);
  const onChange = (e, newValue) => {
    if (newValue) {
      api.getGroupInfoForUserAsync(newValue.id, props.userId).then((e) => {
        setGroup(e);
        showModal(true);
        setSearchTerm(newValue.name);
      });
    }
  };
  const find = options.find(
    (g) => g.name.toLowerCase() === searchTerm?.toLowerCase()
  );
  const onClick = (e) => {
    let promise;
    if (group) {
      promise = api
        .manageUserToGroup(group.groupId, "leave")
        .then((e) => setGroup(null));
    } else {
      promise = api
        .manageUserToGroup(find.id, "enter")
        .then(() => setGroup({ groupId: find.id }));
    }
    promise.finally(() => props.setNewChat((chat) => !chat));
  };
  const color = group ? "error" : "success";
  const textButton = group ? "Выйти" : "Вступить";
  const styles = find
    ? find.thumbnail.indexOf("user") !== -1
      ? stringAvatar(find.name)
      : { src: find?.thumbnail }
    : null;
  return (
    <div className="main__search-table">
      <Modal
        disableAutoFocus={true}
        open={modal}
        onClose={() => showModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {find ? (
          <Box sx={style}>
            <Stack direction="row" spacing={3}>
              <Avatar {...styles}></Avatar>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {find.name}
              </Typography>
            </Stack>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {find.description}
            </Typography>
            <Button
              variant="contained"
              color={color}
              onClick={onClick}
              autoFocus
            >
              {textButton}
            </Button>
          </Box>
        ) : (
          <img
            style={{ objectFit: "cover", ...style }}
            src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg"
          />
        )}
      </Modal>
      <div className="main__left">
        <div className="main__general">Поиск</div>
        <div className="main__star-icon">
          <span className="icon-star"></span>
        </div>
      </div>
      <div className="main__right">
        <div className="main__peoples">
          <div className="main__figure">
            <div className="first"></div>
            <div className="second"></div>
          </div>
          <div className="main__people-counter">1,093</div>
        </div>
        <Autocomplete
          id="free-solo-demo"
          options={options}
          getOptionLabel={(Option) => Option.name}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              showModal(true);
            }
          }}
          onChange={onChange}
          onInput={onInput}
          sx={{ width: "300px", marginLeft: "10px" }}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
        <div className="main__notic">
          <span className="icon-search"></span>
          <span className="icon-notifications-outline"></span>
        </div>
        <div className="main__dots">
          <span className="icon-dots-three-vertical"></span>
        </div>
      </div>
    </div>
  );
};
export default Search;
