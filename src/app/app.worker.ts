/// <reference lib="webworker" />

import { ProcessServerData } from "src/extern-functions/app-worker-processes";

addEventListener('message', ({ data }) => {
  const response = ProcessServerData.processServerResponse(data);
  postMessage(response);
});