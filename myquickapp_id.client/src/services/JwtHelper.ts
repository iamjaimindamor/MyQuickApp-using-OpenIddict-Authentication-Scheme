export const decodeIdentityToken = (id_token: string) => {
  const parts = id_token.split(".");

  if (parts.length != 3) {
    throw new Error(
      "Invalid Identity Token : Each Token Consists of three parts i> Header ii> Payload iii> Data "
    );
  }

  const decoded_Payload = urlBase64Decode(parts[1]);

  if (!decoded_Payload) {
    throw new Error("Token Cannot be decoded");
  }
  return JSON.parse(decoded_Payload);
};

export const urlBase64Decode = (payload: string) => {
  let output = payload.replace(/-/g, "+").replace(/_/, "/");

  switch (output.length % 4) {
    case 0: {
      break;
    }
    case 2: {
      output += "==";
      break;
    }
    case 3: {
      output += "=";
      break;
    }
    default: {
      throw new Error("Illegal base64url string!");
    }
  }

  return decodeURIComponent(
    atob(output)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
};
