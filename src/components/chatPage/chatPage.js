import TabPanel from "../tab/tab";
import Search from "../search/search";
import Chat from "../chat/chat";
import Message from "../message/message";
import Profile from "../profile/profile";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Api from "../../services/Api";
import { getToken } from "../../services/Api";
import { useParams } from "react-router-dom";
import { HttpTransportType } from "@microsoft/signalr";
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { SwitchTransition } from "react-transition-group";
import { CSSTransition } from "react-transition-group";
import { HubConnectionBuilder } from "@microsoft/signalr";
const ChatPage = (props) => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [user, setUser] = useState({});
  const api = useMemo(() => new Api(), []);
  const { nickname } = useParams();
  const [newChat, setNewChat] = useState(false);
  const [isPending, setTransition] = useTransition();
  const [haveMessages, setHaveMessages] = useState(true);
  const [needMessages, setNeedMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageForModal, setMessageForModal] = useState("");
  const [errorForUser, setErrorForUser] = useState(false);
  const chatRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const setChatSmooth = (id) => {
    setTransition(() => {
      setChat(id);
      setMessages([]);
      setHaveMessages(true);
      setPage(1);
      connection?.off("Receive", onReceive);
    });
  };
  const onScroll = useCallback((e) => {
    if (e.target.scrollTop === 0) {
      setTransition(() => {
        setNeedMessages(true);
      });
    }
  }, []);
  const onReceive = useCallback(
    (getMessageDto) => {
      if (getMessageDto.groupId === chat) {
        setMessages((messages) => [...messages, getMessageDto]);
        setTimeout(() => {
          chatRef?.current?.scrollTo({
            top: chatRef?.current?.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    },
    [chat]
  );
  const onSubmit = () => {
    connection
      .invoke("SendToAll", { text: messageText }, chat)
      .then(() => setMessageText(""))
      .catch((e) => {
        setError(true);
        setMessageForModal(e.message);
      });
  };

  useEffect(() => {
    api.getUser(nickname).then((e) => setUser(e));
  }, []);
  useEffect(() => {
    if (user) {
      if (user.fullName && user.fullName !== "") setCounter((old) => old + 1);
      if (counter >= 1) {
        api
          .updateUser(
            { fullName: user.fullName, nickname: user.nickname },
            user.id
          )
          .catch((e) => {
            console.log(e);
            setErrorForUser(true);
            setMessageForModal(e.message);
          });
      }
    }
  }, [user.fullName, user.nickname]);
  useEffect(() => {
    if (chat) {
      if (haveMessages) {
        setLoading(true);
        api
          .getMessageForGroupById(chat, page, pageSize)
          .then((messages) => {
            setMessages((oldMessages) => [...messages, ...oldMessages]);
            setNeedMessages(false);
            setPage((oldPage) => oldPage + 1);
            if (messages.length < pageSize) setHaveMessages(false);
          })
          .catch((e) => {
            if (e.message.indexOf("end of JSON") === -1) {
              setMessageForModal(e.message);
              setError(true);
            }
          })
          .finally(setLoading(false));
      }
    }
  }, [needMessages, chat]);
  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("http://localhost:5090/chat", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: async () => getToken(),
      })
      .withAutomaticReconnect()
      .build();
    setConnection(connect);
  }, []);
  useEffect(() => {
    if (connection) {
      connection.start();
    }
  }, [connection]);
  useEffect(() => connection?.on("Receive", onReceive), [onReceive]);

  return (
    <section className="main">
      <TabPanel
        currentChat={chat}
        userId={user.id}
        setChat={setChatSmooth}
        newChat={newChat}
      ></TabPanel>

      <div className="main__center">
        <Search setNewChat={setNewChat} userId={user.id}></Search>
        <SwitchTransition>
          <CSSTransition classNames="fade" key={chat} timeout={500}>
            {chat ? (
              <>
                <Chat messages={messages} onScroll={onScroll} chatRef={chatRef}>
                  {error ? (
                    <Alert severity="error">
                      <AlertTitle>Информация</AlertTitle>
                      {messageForModal} — <strong>check it out!</strong>
                    </Alert>
                  ) : null}
                  {loading ? <CircularProgress /> : null}
                </Chat>
                <Message
                  onInput={setMessageText}
                  value={messageText}
                  onSubmit={onSubmit}
                ></Message>
              </>
            ) : (
              <Box
                pb={2}
                mt={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <img
                  src="https://img.freepik.com/premium-vector/cute-robot-holds-heart-his-hand-card-valentines-day-flat-character_124715-318.jpg"
                  style={{ objectFit: "cover", width: "40%", height: "100%" }}
                ></img>
                <Typography
                  variant="subtitle2"
                  fontSize={15}
                  fontWeight={700}
                  mt={2}
                >
                  Нажмите на чат прямо сейчас, чтобы начать общение!
                </Typography>
              </Box>
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>
      {!user.id ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginInline: "auto",
          }}
        >
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Profile
          user={user}
          setUser={setUser}
          error={
            errorForUser ? (
              <Alert severity="error" sx={{ mt: "5px" }}>
                {messageForModal}
              </Alert>
            ) : null
          }
        ></Profile>
      )}
    </section>
  );
};
export default ChatPage;
