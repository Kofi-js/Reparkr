import * as React from "react";

export const EmailTemplate = ({
  username,
  plate,
}: {
  username: string;
  plate: string;
}) => (
  <div>
    <h1>Hey, {username}!</h1>
    <p>🚘 Someone is trying to leave. Please repark your car: {plate}</p>
  </div>
);

export default EmailTemplate;
