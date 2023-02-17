import React from "react";
import Api from "../../helpers/api";
import Button from "../Common/Button";

export default function Schedule() {
  const [apiResponse, setApiResponse] = React.useState("");
  const api = new Api();
  async function testAPI() {
    api.test().then((res) => {
        console.log(res)
      setApiResponse(res.message);
    });
  }

  return (
    <div>
      <h1>Schedule</h1>
      <Button onClick={testAPI}>Test api</Button>
      <div>{apiResponse}</div>
    </div>
  );
}
