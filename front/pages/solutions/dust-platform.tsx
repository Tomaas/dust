import { Button, Div3D, Hover3D } from "@dust-tt/sparkle";
import type { ReactElement } from "react";

import {
  HeaderContentBlock,
  ImgBlock,
} from "@app/components/home/new/ContentBlocks";
import { Grid } from "@app/components/home/new/ContentComponents";
import type { LandingLayoutProps } from "@app/components/home/new/LandingLayout";
import LandingLayout from "@app/components/home/new/LandingLayout";
import {
  getParticleShapeIndexByName,
  shapeNames,
} from "@app/components/home/new/Particles";
import config from "@app/lib/api/config";
import { getSession } from "@app/lib/auth";
import {
  getUserFromSession,
  makeGetServerSidePropsRequirementsWrapper,
} from "@app/lib/iam/session";
import { classNames } from "@app/lib/utils";

export const getServerSideProps = makeGetServerSidePropsRequirementsWrapper({
  requireUserPrivilege: "none",
})<{
  gaTrackingId: string;
  shape: number;
}>(async (context) => {
  // Fetch session explicitly as this page redirects logged in users to our home page.
  const session = await getSession(context.req, context.res);
  const user = await getUserFromSession(session);

  if (user && user.workspaces.length > 0) {
    let url = `/w/${user.workspaces[0].sId}`;

    if (context.query.inviteToken) {
      url = `/api/login?inviteToken=${context.query.inviteToken}`;
    }

    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  }

  return {
    props: {
      gaTrackingId: config.getGaTrackingId(),
      shape: getParticleShapeIndexByName(shapeNames.galaxy),
    },
  };
});

export default function DustPlatform() {
  return (
    <>
      <HeaderContentBlock
        uptitle="Dust Platform"
        title={
          <>
            Developer-
            <br />
            and&nbsp;tinkerer-friendly
          </>
        }
        from="from-amber-200"
        to="to-amber-400"
        subtitle={
          <>
            Build custom actions and&nbsp;application orchestration to&nbsp;fit
            your team's exact&nbsp;needs.
            <br />
            <a href="https://docs.dust.tt" target="_blank">
              <Button
                variant="primary"
                label="Consult our Documentation"
                size="md"
                className="mt-8"
              />
            </a>
          </>
        }
      />
      <Grid>
        <div
          className={classNames(
            "col-span-12 grid grid-cols-1 gap-8",
            "md:grid-cols-2",
            "lg:col-span-10 lg:col-start-2"
          )}
        >
          <ImgBlock
            title={
              <>
                Dust Apps:
                <br />
                Expands your&nbsp;assistants' capabilities
              </>
            }
            content={[
              <>
                Complete complex workflows and&nbsp;specific tasks
                by&nbsp;calling models, reaching APIs, executing code,
                or&nbsp;consulting Data&nbsp;Sources.
              </>,
              <>
                Go beyond simple prompt/response interactions by&nbsp;enabling
                a&nbsp;broader set of&nbsp;actions, chaining multiple models,
                or&nbsp;even calling into&nbsp;your&nbsp;own infrastructure.
              </>,
            ]}
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/apps/apps1.png" />
              </Div3D>
              <Div3D depth={0} className="absolute top-0">
                <img src="/static/landing/apps/apps2.png" />
              </Div3D>
              <Div3D depth={15} className="absolute top-0">
                <img src="/static/landing/apps/apps3.png" />
              </Div3D>
              <Div3D depth={60} className="absolute top-0">
                <img src="/static/landing/apps/apps4.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
          <ImgBlock
            title={
              <>
                Dust API:
                <br />
                Use Dust and&nbsp;manage your&nbsp;Data programmatically
              </>
            }
            content={[
              <>
                Dust's API enables programmatic interactions with all
                of&nbsp;Dust including Data Sources and&nbsp;assistants
                for&nbsp;advanced use&nbsp;cases.
              </>,
              <>
                Use Dust on&nbsp;your&nbsp;terms and&nbsp;on the&nbsp;product
                surfaces of&nbsp;your&nbsp;choice.
              </>,
            ]}
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/api/api1.png" />
              </Div3D>
              <Div3D depth={20} className="absolute top-0">
                <img src="/static/landing/api/api2.png" />
              </Div3D>
              <Div3D depth={60} className="absolute top-0">
                <img src="/static/landing/api/api3.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
        </div>
      </Grid>
    </>
  );
}

DustPlatform.getLayout = (
  page: ReactElement,
  pageProps: LandingLayoutProps
) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
