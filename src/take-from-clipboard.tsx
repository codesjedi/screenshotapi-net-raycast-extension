import { Clipboard, Detail, getPreferenceValues, showHUD, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { takeScreenshot } from "./api";

export default function TakefromclipboardCommand() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const preferences = getPreferenceValues();
  const apiKey = preferences.apiKey;

  useEffect(() => {
    Clipboard.readText().then((text) => {
      if (!text) {
        return;
      }
      setUrl(text);
      takeScreenshot(text, apiKey)
        .then((response) => {
          if (response.error) {
            showToast({
              title: "Failed to take screenshot",
              message: response.error,
              style: Toast.Style.Failure,
            });
            setIsLoading(false);
          }
          if (response.screenshot) {
            Clipboard.copy(response.screenshot);
            showToast({
              title: "Screenshot Taken",
              message: "The screenshot has been copied to your clipboard",
            });
            setIsLoading(false);
            showHUD("screenshot url copied to your clipboard ✅");
          }
        })
        .catch((error) => {
          console.error(error);
          showToast({
            title: "Failed to take screenshot",
            message: "An error occurred while taking the screenshot",
            style: Toast.Style.Failure,
          });
          showHUD("Failed to take screenshot");
        });
    });
  }, [url]);

  return <Detail markdown={`Taking screenshot of ${url}, please wait...`} isLoading={isLoading} />;
}
