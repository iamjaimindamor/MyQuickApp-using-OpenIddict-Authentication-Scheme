export const environment = ()=> {
    let base = "";

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");
    }
  
    return base.replace(/\/$/, "");
};