import courseConfig from "./course.config";
import AppError from "@/utils/error";

const _fetch = async (url, course, method, headers = {}, body = {}, abortController = new AbortController()) => {
  const _course = course.toLowerCase();
  const _url = `${courseConfig[_course].url}${url}`;
  const _body = (method === "GET") ? Object.keys(body).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`).join("&") : JSON.stringify(body);
  const _parseAPI = {
    "X-Parse-REST-API-Key": courseConfig[_course].apiKey,
    "X-Parse-Application-Id": courseConfig[_course].applicationId
  };

  return await fetch(_url, {
    method,
    headers: {
      ...((method === "GET") ? {} : { "Content-Type": "application/json" }),
      ..._parseAPI,
      ...headers
    },
    signal: abortController.signal,
    ...((method === "GET") ? {} : { body: _body })
  });
};

export const getAvailableCourse = () => Object.keys(courseConfig);

export const callMethod = async (course, name, params = {}, abortController = new AbortController()) => {
  try {
    const _response = await _fetch(`/functions/${name}`, course, "POST", {}, params, abortController);
    if (_response.status !== 200) { return new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    const _data = await _response.json();
    if (!_data.result) { throw new Error("No feedback"); }
    if (_data.result.error) { throw new Error(_data.result.error); }
    return _data.result;
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const validUserSessionToken = async (course, sessionToken = "", abortController = new AbortController()) => {
  try {
    const _response = await _fetch("/users/me", course, "GET", { "X-Parse-Session-Token": sessionToken }, {}, abortController);
    if (_response.status !== 200) { return new AppError({ text: "session-invalidation", status: _response.status, message: _response.statusText }); }

    const _user = await _response.json();
    if (_user.code === 209) { return new AppError({ text: "session-invalidation", status: 209, message: _user.error }); }
    return { objectId: _user.objectId, name: _user.name, email: _user.email, expiredDate: _user.expiredDate, sessionToken }; 
  } catch (error) {
    console.error(error);
    return new AppError({ message: error.message });
  }
};

export const updateUser = async (course, objectId, data = {}, sessionToken = "", abortController = new AbortController()) => {
  try {
   const _response = await _fetch(`/users/${objectId}`, course, "PUT", { "X-Parse-Session-Token": sessionToken }, data, abortController);
   if (_response.status !== 200) { return new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    return await _response.json();
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const retrieveParseObjects = async (course, className, keys = "objectId", sessionToken = "", abortController = new AbortController()) => {
  try {
    const _response = await _fetch(`/classes/${className}`, course, "GET", { "X-Parse-Session-Token": sessionToken }, { "keys": (Array.isArray(keys)) ? keys.join(",") : keys }, abortController);
    if (_response.status !== 200) { new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    const _objects = await _response.json();
    return (_objects.hasOwnProperty("results")) ? _objects.results : [];
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const createParseObject = async (course, className, data = {}, sessionToken = "", abortController = new AbortController()) => {
  try {
    const _response = await _fetch(`/classes/${className}`, course, "POST", { "X-Parse-Session-Token": sessionToken }, data, abortController);
    if (_response.status !== 200) { new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    return await _response.json();
  } catch (error) {
    return new AppError({ message: error.message });
  }
};
