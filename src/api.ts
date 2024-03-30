import fetch from "node-fetch";

import { ScreenshotapiResponse } from "./types";

export async function takeScreenshot(url: string, apiKey: string) {
  const baseUrl = `https://shot.screenshotapi.net/screenshot?`;
  const params = new URLSearchParams({
    url: url,
    token: apiKey.trim(),
    output: "json",
    file_type: "png",
    wait_for_event: "load",
  });
  const query = `${baseUrl}${params.toString()}`;
  console.log("query: ", query);
  const response = await fetch(query);
  const data = (await response.json()) as ScreenshotapiResponse;
  return data;
}
