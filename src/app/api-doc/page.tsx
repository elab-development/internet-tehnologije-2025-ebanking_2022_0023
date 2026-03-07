// @ts-ignore
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function ApiDocPage() {
  return (
    <div>
      <h1>API Doc</h1>
      <SwaggerUI url="swagger.json" />
    </div>
  );
}

export default ApiDocPage;
