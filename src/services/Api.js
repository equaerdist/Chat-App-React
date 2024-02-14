import { string } from "yup";

const getToken = () => localStorage.getItem("token");
const checkErrorsInResponse = async (res) => {
  if (!res.ok) {
    let erros = "Возникли некоторые ошибки...\n";
    let info = null;
    console.log(res.headers);
    if (!res.headers.get("Content-length") === "0") info = await res.json();
    if (info) {
      if (info.errors !== null) {
        for (let key in info.errors) {
          erros += `- ${key}: ${info.errors[key]}\n`;
        }
      } else {
        erros += info.Detail;
      }
    }
    throw new Error(erros);
  }
};
const getResource = async (
  url,
  headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken(),
  }
) => {
  headers = {
    ...headers,
    Authorization: "Bearer " + getToken(),
  };
  let res = await fetch(url, { method: "GET", headers });
  await checkErrorsInResponse(res);
  try {
    if (res.headers.get("Content-length") !== "0") return await res.json();
  } catch (e) {
    console.log(e.message);
    return;
  }
};
const updateResource = async (url, body, headers) => {
  headers = {
    ...headers,
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken(),
  };
  let res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  await checkErrorsInResponse(res);
  try {
    return await res.json();
  } catch (e) {
    console.log(e.message);
    return;
  }
};
const sendResource = async (
  url,
  body,
  headers = {
    "Content-Type": "application/json",
  }
) => {
  headers = {
    ...headers,
    Authorization: "Bearer " + getToken(),
  };
  let res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  await checkErrorsInResponse(res);
  if (res.headers.get("Content-length") === "0") return;
  try {
    return await res.json();
  } catch (e) {
    return;
  }
};
class Api {
  #_apiBase = "http://localhost:5090/api/";
  async checkAuth() {
    let res = await getResource(this.#_apiBase + "auth");
    return res;
  }
  async getAuth(getAuthDto) {
    let res = await sendResource(this.#_apiBase + "auth", getAuthDto);
    localStorage.setItem("token", res.token);
  }
  async registerUser(addUserDto) {
    let res = await sendResource(this.#_apiBase + "user", addUserDto);
    return res;
  }
  async getUser(nickname) {
    let res = await getResource(`${this.#_apiBase}user/${nickname}`);
    return res;
  }
  async getGroupsForUser(id, pageSize, page) {
    let res = await getResource(
      `${
        this.#_apiBase
      }user/${id}/groups/?page=${page}&pageSize=${pageSize}&sortTerm=LastMessageTime`
    );
    return res;
  }
  async getMessageForGroupById(id, page, pageSize) {
    let res = await getResource(
      `${this.#_apiBase}group/${id}/messages/?page=${page}&pageSize=${pageSize}`
    );
    return res;
  }
  async addMessageAsync(addMessageDto, id) {
    let res = await sendResource(
      `${this.#_apiBase}group/${id}/messages`,
      addMessageDto
    );
    return res;
  }
  async getGroupForSeachAsync(searchTerm) {
    let res = await getResource(
      `${this.#_apiBase}group/?searchTerm=${searchTerm}`
    );
    return res;
  }
  async getGroupInfoForUserAsync(groupId, userId) {
    let res = await getResource(
      `${this.#_apiBase}user/${userId}/groups/${groupId}`
    );
    return res;
  }
  async manageUserToGroup(groupId, action) {
    let res = await getResource(
      `${this.#_apiBase}group/${groupId}/manage?action=${action}`
    );
    return res;
  }
  async updateUser(updateUserDto, userId) {
    let res = await updateResource(
      `${this.#_apiBase}user/${userId}`,
      updateUserDto
    );
    return res;
  }
  async addGroup(addGroupDto) {
    let res = await sendResource(`${this.#_apiBase}group`, addGroupDto);
    return res;
  }
}
export default Api;
export { getToken };
