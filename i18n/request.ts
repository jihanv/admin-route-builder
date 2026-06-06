import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async () => ({
  locale: routing.defaultLocale,
  messages: (await import("../messages/en.json")).default,
}));
