import type {
  AgentConfigurationType,
  AppType,
  DataSourceType,
  PlanType,
  SubscriptionType,
  WorkspaceType,
} from "@dust-tt/types";
import {
  isDustAppRunConfiguration,
  isProcessConfiguration,
  isRetrievalConfiguration,
  isTablesQueryConfiguration,
} from "@dust-tt/types";
import type { InferGetServerSidePropsType } from "next";

import type { BuilderFlow } from "@app/components/assistant_builder/AssistantBuilder";
import AssistantBuilder, {
  BUILDER_FLOWS,
} from "@app/components/assistant_builder/AssistantBuilder";
import { buildInitialState } from "@app/components/assistant_builder/server_side_props_helpers";
import type { AssistantBuilderInitialState } from "@app/components/assistant_builder/types";
import { getApps } from "@app/lib/api/app";
import { getAgentConfiguration } from "@app/lib/api/assistant/configuration";
import { getDataSources } from "@app/lib/api/data_sources";
import { deprecatedGetFirstActionConfiguration } from "@app/lib/deprecated_action_configurations";
import { withDefaultUserAuthRequirements } from "@app/lib/iam/session";

const { GA_TRACKING_ID = "", URL = "" } = process.env;

export const getServerSideProps = withDefaultUserAuthRequirements<{
  owner: WorkspaceType;
  subscription: SubscriptionType;
  plan: PlanType;
  gaTrackingId: string;
  dataSources: DataSourceType[];
  dustApps: AppType[];
  retrievalConfiguration: AssistantBuilderInitialState["retrievalConfiguration"];
  dustAppConfiguration: AssistantBuilderInitialState["dustAppConfiguration"];
  tablesQueryConfiguration: AssistantBuilderInitialState["tablesQueryConfiguration"];
  processConfiguration: AssistantBuilderInitialState["processConfiguration"];
  agentConfiguration: AgentConfigurationType;
  flow: BuilderFlow;
  baseUrl: string;
}>(async (context, auth) => {
  const owner = auth.workspace();
  const plan = auth.plan();
  const subscription = auth.subscription();
  if (
    !owner ||
    !plan ||
    !subscription ||
    !auth.isUser() ||
    !context.params?.aId
  ) {
    return {
      notFound: true,
    };
  }

  const allDataSources = await getDataSources(auth);

  const dataSourcesByName = allDataSources.reduce(
    (acc, ds) => ({ ...acc, [ds.name]: ds }),
    {} as Record<string, DataSourceType>
  );
  const configuration = await getAgentConfiguration(
    auth,
    context.params?.aId as string
  );
  if (configuration?.scope === "workspace" && !auth.isBuilder()) {
    return {
      notFound: true,
    };
  }

  if (!configuration) {
    return {
      notFound: true,
    };
  }

  const flow: BuilderFlow = BUILDER_FLOWS.includes(
    context.query.flow as BuilderFlow
  )
    ? (context.query.flow as BuilderFlow)
    : "personal_assistants";

  const allDustApps = await getApps(auth);

  const {
    retrievalConfiguration,
    dustAppConfiguration,
    tablesQueryConfiguration,
    processConfiguration,
  } = await buildInitialState({
    configuration,
    dataSourcesByName,
    dustApps: allDustApps,
  });

  return {
    props: {
      owner,
      plan,
      subscription,
      gaTrackingId: GA_TRACKING_ID,
      dataSources: allDataSources,
      dustApps: allDustApps,
      retrievalConfiguration,
      dustAppConfiguration,
      tablesQueryConfiguration,
      processConfiguration,
      agentConfiguration: configuration,
      flow,
      baseUrl: URL,
    },
  };
});

export default function EditAssistant({
  owner,
  subscription,
  plan,
  gaTrackingId,
  dataSources,
  dustApps,
  retrievalConfiguration,
  dustAppConfiguration,
  tablesQueryConfiguration,
  processConfiguration,
  agentConfiguration,
  flow,
  baseUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let actionMode: AssistantBuilderInitialState["actionMode"] = "GENERIC";

  const action = deprecatedGetFirstActionConfiguration(agentConfiguration);

  if (isRetrievalConfiguration(action)) {
    if (action.query === "none") {
      if (
        action.relativeTimeFrame === "auto" ||
        action.relativeTimeFrame === "none"
      ) {
        /** Should never happen. Throw loudly if it does */
        throw new Error(
          "Invalid configuration: exhaustive retrieval must have a definite time frame"
        );
      }
      actionMode = "RETRIEVAL_EXHAUSTIVE";
    }
    if (action.query === "auto") {
      actionMode = "RETRIEVAL_SEARCH";
    }
  }

  if (isDustAppRunConfiguration(action)) {
    actionMode = "DUST_APP_RUN";
  }

  if (isTablesQueryConfiguration(action)) {
    actionMode = "TABLES_QUERY";
  }

  if (isProcessConfiguration(action)) {
    if (
      action.relativeTimeFrame === "auto" ||
      action.relativeTimeFrame === "none"
    ) {
      /** Should never happen as not permitted for now. */
      throw new Error(
        "Invalid configuration: process must have a definite time frame"
      );
    }
    actionMode = "PROCESS";
  }

  if (agentConfiguration.scope === "global") {
    throw new Error("Cannot edit global assistant");
  }

  return (
    <AssistantBuilder
      owner={owner}
      subscription={subscription}
      plan={plan}
      gaTrackingId={gaTrackingId}
      dataSources={dataSources}
      dustApps={dustApps}
      flow={flow}
      initialBuilderState={{
        actionMode,
        retrievalConfiguration,
        dustAppConfiguration,
        tablesQueryConfiguration,
        processConfiguration,
        scope: agentConfiguration.scope,
        handle: agentConfiguration.name,
        description: agentConfiguration.description,
        instructions: agentConfiguration.instructions || "", // TODO we don't support null in the UI yet
        avatarUrl: agentConfiguration.pictureUrl,
        generationSettings: {
          modelSettings: {
            modelId: agentConfiguration.model.modelId,
            providerId: agentConfiguration.model.providerId,
          },
          temperature: agentConfiguration.model.temperature,
        },
      }}
      agentConfigurationId={agentConfiguration.sId}
      baseUrl={baseUrl}
      defaultTemplate={null}
    />
  );
}
