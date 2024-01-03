import {
  DriveLogo,
  GithubLogo,
  IntercomLogo,
  NotionLogo,
  SlackLogo,
} from "@dust-tt/sparkle";
import { ConnectorProvider } from "@dust-tt/types";

export const CONNECTOR_CONFIGURATIONS: Record<
  ConnectorProvider,
  {
    name: string;
    connectorProvider: ConnectorProvider;
    isBuilt: boolean;
    logoPath: string;
    logoComponent: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
    description: string;
    limitations: string | null;
    isNested: boolean;
  }
> = {
  notion: {
    name: "Notion",
    connectorProvider: "notion",
    isBuilt: true,
    logoPath: "/static/notion_32x32.png",
    description:
      "Authorize granular access to your company's Notion workspace, by top-level pages.",
    limitations: "External files and content behind links are not indexed.",
    logoComponent: NotionLogo,
    isNested: true,
  },
  google_drive: {
    name: "Google Drive™",
    connectorProvider: "google_drive",
    isBuilt: true,
    logoPath: "/static/google_drive_32x32.png",
    description:
      "Authorize granular access to your company's Google Drive, by drives and folders. Supported files include GDocs, GSlides, and .txt files. Email us for .pdf indexation.",
    limitations:
      "Files with more than 750KB of extracted text are ignored. By default, PDF files are not indexed. Email us at team@dust.tt to enable PDF indexing.",
    logoComponent: DriveLogo,
    isNested: true,
  },
  slack: {
    name: "Slack",
    connectorProvider: "slack",
    isBuilt: true,
    logoPath: "/static/slack_32x32.png",
    description:
      "Authorize granular access to your Slack workspace on a channel-by-channel basis.",
    limitations: "External files and content behind links are not indexed.",
    logoComponent: SlackLogo,
    isNested: false,
  },
  github: {
    name: "GitHub",
    connectorProvider: "github",
    isBuilt: true,
    logoPath: "/static/github_black_32x32.png",
    description:
      "Authorize access to your company's GitHub on a repository-by-repository basis. Dust can access Issues, Discussions, and Pull Request threads. Code indexation is coming soon.",
    limitations:
      "Dust only gathers data from issues, discussions and top-level pull requests (but not in-code comments in pull requests, nor the actual source code or other Github data).",
    logoComponent: GithubLogo,
    isNested: true,
  },
  intercom: {
    name: "Intercom",
    connectorProvider: "intercom",
    isBuilt: false,
    logoPath: "/static/intercom_32x32.png",
    description:
      "Authorize granular access to your company's Intercom Help Centers. Dust does not access your conversations.",
    limitations: null,
    logoComponent: IntercomLogo,
    isNested: false,
  },
  webcrawler: {
    name: "Web Crawler",
    connectorProvider: "webcrawler",
    isBuilt: true,
    logoPath: "/static/intercom_32x32.png",
    description:
      "Crawl a website.",
    limitations: null,
    logoComponent: IntercomLogo,
    isNested: false,
  },  
};
