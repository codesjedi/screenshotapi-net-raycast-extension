import { useState } from "react";
import {
  Action,
  ActionPanel,
  Form,
  showToast,
  Toast,
  getPreferenceValues,
  Clipboard,
  LaunchProps,
  showHUD,
} from "@raycast/api";
import { useForm } from "@raycast/utils";

import { takeScreenshot } from "./api";

type FormValues = {
  url: string;
};
const Take = (props: LaunchProps<{ draftValues: FormValues }>) => {
  const [isLoading, setIsLoading] = useState(false);
  const preferences = getPreferenceValues();
  const { handleSubmit } = useForm<FormValues>({
    initialValues: {
      url: "",
    },
    onSubmit: async (value) => {
      if (!value.url) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Invalid URL",
          message: "Please provide a valid URL",
        });
        return;
      }
      setIsLoading(true);
      try {
        const { screenshot, error } = await takeScreenshot(value.url, preferences.apiKey);
        if (error) {
          await showToast({
            style: Toast.Style.Failure,
            title: "Failed to take screenshot",
            message: error,
          });
        }
        if (screenshot) {
          Clipboard.copy(screenshot);
          await showToast({
            title: "Screenshot Taken",
            message: "The screenshot has been copied to your clipboard",
          });
          await showHUD("screenshot url copied to your clipboard ✅");
        } else {
          await showToast({
            style: Toast.Style.Failure,
            title: "Failed to take screenshot",
            message: "An error occurred while taking the screenshot",
          });
        }
      } catch (error) {
        console.error(error);
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to take screenshot",
          message: error instanceof Error ? error.message : "An error occurred while taking the screenshot",
        });
        await showHUD("failed to take screenshot ❌");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { draftValues } = props;

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Take Screenshot" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="url"
        title="website url"
        placeholder="https://screenshotapi.net"
        defaultValue={draftValues?.url}
      />
    </Form>
  );
};

export default Take;
