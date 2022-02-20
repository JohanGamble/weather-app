/// <reference lib="webworker" />

import { ProcessServerData } from "src/extern-functions/app-worker-processes";

addEventListener('message', ({ data }) => {
  const response = ProcessServerData.deriveNearbyCities(data);
  postMessage(response);
});