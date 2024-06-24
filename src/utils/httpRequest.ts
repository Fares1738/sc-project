export const performPOST = async (
  url: string,
  body: BodyInit,
  onSuccess: Function,
  onError: Function
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const isSuccess = response.ok && response.status == 200;
    if (isSuccess) {
      console.log("SUCCESS");
      onSuccess(response);
    } else {
      const message = await response.json();
      console.log("ERROR");
      onError(message);
    }
  } catch (err) {
    onError(err);
  }
};

export const performBriefPOST = async (
  url: string,
  body: BodyInit,
  name: string
) => {
  await performPOST(
    url,
    body,
    (res: any) => {
      console.log(name + " res:", res);
    },
    (err: any) => {
      console.log(name + " err:", err);
    }
  );
};

export const performPUT = async (
  url: string,
  body: BodyInit,
  onSuccess: Function,
  onError: Function
) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const isSuccess = response.ok && response.status == 200;
    if (isSuccess) {
      console.log("SUCCESS");
      onSuccess(response);
    } else {
      const message = await response.json();
      console.log("ERROR");
      onError(message);
    }
  } catch (err) {
    onError(err);
  }
};

export const performGET = async (
  url: string,
  body: URLSearchParams,
  onSuccess: Function,
  onError: Function
) => {
  try {
    const response = await fetch(url + "?" + new URLSearchParams(body), {
      method: "GET",  
    });
    const isSuccess = response.ok && response.status == 200;
    if (isSuccess) {
      console.log("SUCCESS");
      const message = await response.json();
      onSuccess(message);
    } else {
      const message = await response.json();
      console.log("ERROR");
      onError(message);
    }
  } catch (err) {
    onError(err);
  }
};
