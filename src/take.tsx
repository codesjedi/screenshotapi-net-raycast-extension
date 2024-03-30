import { Action, ActionPanel, Form, showToast, Toast, getPreferenceValues, Clipboard, LaunchProps } from "@raycast/api";
import { useForm, useFetch } from "@raycast/utils";

import { ScreenshotapiResponse } from "./types";
import { useState } from "react";
import { takeScreenshot } from "./api";

type FormValues = {
  url: string;
};
const Take = (props: LaunchProps<{ draftValues: FormValues }>) => {
  const [isLoading, setIsLoading] = useState(false);
  const preferences = getPreferenceValues();
  const { handleSubmit, values } = useForm<FormValues>({
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
        const { screenshot } = await takeScreenshot(value.url, preferences.apiKey);
        Clipboard.copy(screenshot);
        await showToast({
          title: "Screenshot Taken",
          message: "The screenshot has been copied to your clipboard",
        });
      } catch (error) {
        console.error(error);
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to take screenshot",
          message: error instanceof Error ? error.message : "An error occurred while taking the screenshot",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { draftValues } = props;
  const baseUrl = `https://api.screenshotapi.net/api/v1/screenshot?`;
  const params = new URLSearchParams({
    url: values.url,
    token: preferences.apiKey.trim(),
  });
  const url = `${baseUrl}${params.toString()}`;

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
