import { Div3D, Hover3D } from "@dust-tt/sparkle";
import type { ReactElement } from "react";
import React from "react";

import {
  HeaderContentBlock,
  ImgBlock,
} from "@app/components/home/new/ContentBlocks";
import { A, Grid, P, Strong } from "@app/components/home/new/ContentComponents";
import type { LandingLayoutProps } from "@app/components/home/new/LandingLayout";
import LandingLayout from "@app/components/home/new/LandingLayout";
import {
  getParticleShapeIndexByName,
  shapeNames,
} from "@app/components/home/new/Particles";
import config from "@app/lib/api/config";
import { getSession } from "@app/lib/auth";
import { getUserFromSession } from "@app/lib/iam/session";
import { makeGetServerSidePropsRequirementsWrapper } from "@app/lib/iam/session";
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
      shape: getParticleShapeIndexByName(shapeNames.icosahedron),
    },
  };
});

export default function Security() {
  return (
    <>
      <HeaderContentBlock
        title={<>Security is&nbsp;non-negotiable</>}
        from="from-green-200"
        to="to-emerald-400"
        uptitle="Designed for enterprises"
        subtitle={
          <>
            We've made security our core focus from day&nbsp;one to safeguard
            your&nbsp;company&nbsp;data and workspace&nbsp;privacy.
            <div className="flex gap-6 py-8">
              <img src="/static/landing/security/gdpr.svg" className="h-28" />
              <img src="/static/landing/security/soc2.svg" className="h-28" />
            </div>
            <Strong>GDPR Compliant & Soc2 type II certified</Strong>
            <br />
            Learn more about security at&nbsp;Dust in&nbsp;our{" "}
            <A
              href="https://app.vanta.com/dust.tt/trust/f3ytzxpay31bwsiyuqjto"
              target="_blank"
            >
              Trust&nbsp;Center
            </A>
            .
          </>
        }
      />
      <Grid>
        <div
          className={classNames(
            "col-span-12",
            "grid grid-cols-1 gap-12 px-6",
            "sm:grid-cols-2 sm:gap-6 sm:pr-0",
            "lg:col-span-10 lg:col-start-2",
            "xl:col-span-12 xl:grid-cols-4"
          )}
        >
          <P size="md" dotCSS="text-amber-300" shape="triangle">
            <Strong>Encryption at rest</Strong>
            <br />
            Stored data encrypted with&nbsp;AES-256.
          </P>
          <P size="md" dotCSS="text-red-400" shape="rectangle">
            <Strong>Encryption in transit</Strong>
            <br />
            Encrypted with TLS 1.2 or&nbsp;greater.
          </P>
          <P size="md" dotCSS="text-sky-400" shape="circle">
            <Strong>Data segregation</Strong>
            <br />
            By workspace and&nbsp;companies; Services are&nbsp;isolated.
          </P>
          <P size="md" dotCSS="text-emerald-400" shape="hexagon">
            <Strong>No training</Strong>
            <br />
            Customer prompts or&nbsp;data are not&nbsp;used for
            training&nbsp;models.
          </P>
        </div>
      </Grid>
      <Grid>
        <div
          className={classNames(
            "col-span-12 grid grid-cols-1 gap-8",
            "sm:grid-cols-2",
            "lg:col-span-10 lg:col-start-2",
            "2xl:col-span-8 2xl:col-start-3"
          )}
        >
          <ImgBlock
            title={<>Full granularity in data&nbsp;selection.</>}
            content={
              <>
                For each Data&nbsp;Source, granularlly select what&nbsp;you want
                shared with&nbsp;Dust.
              </>
            }
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/selection/selection1.png" />
              </Div3D>
              <Div3D depth={20} className="absolute top-0">
                <img src="/static/landing/selection/selection2.png" />
              </Div3D>
              <Div3D depth={40} className="absolute top-0">
                <img src="/static/landing/selection/selection3.png" />
              </Div3D>
              <Div3D depth={70} className="absolute top-0">
                <img src="/static/landing/selection/selection4.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
          <ImgBlock
            title={<>Manage workspace invitations&nbsp;seamlessly.</>}
            content={
              <>
                Control your workspace with Single Sign-On (SSO) and easy
                batch&nbsp;invites.
              </>
            }
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/member/member1.png" />
              </Div3D>
              <Div3D depth={20} className="absolute top-0">
                <img src="/static/landing/member/member2.png" />
              </Div3D>
              <Div3D depth={40} className="absolute top-0">
                <img src="/static/landing/member/member3.png" />
              </Div3D>
              <Div3D depth={70} className="absolute top-0">
                <img src="/static/landing/member/member4.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
        </div>
      </Grid>
    </>
  );
}

Security.getLayout = (page: ReactElement, pageProps: LandingLayoutProps) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
