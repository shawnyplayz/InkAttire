import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlobalForm from "../GlobalForm/GlobalForm";

function DeleteInner() {
  const location = useLocation();
  const [record, setRecord] = useState(location.state);
  useEffect(() => {
    if (location?.state) {
      console.log("Location state", location.state);
      let asd = { ...location.state };
      setRecord(asd);
      console.log("record==>", record);
    }
  }, [location]);

  return (
    <>{record ? <GlobalForm pageMode="Delete" record={record} /> : null}</>
  );
}

export default DeleteInner;