import { useMemo } from "react";
import { GetStaticPathsResult } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import { ResolvedImage, ResolvedProject } from "../../types";
import makeGetStaticProps, { Props } from "../../utils/makeGetStaticProps";
import getProject from "../../queries/getProject";
import getProjects from "../../queries/getProjects";
import slugify from "../../utils/slugify";
import useData from "../../hooks/useData";
import styled from "styled-components";
import ImageBeam from "../../components/ImageBeam";
import Layout from "../../components/Layout";
import { EMPTY_ARRAY } from "../../constants";
import YoutubePreview from "../../components/YoutubePreview";

const getProjectSlug = (params: NextParsedUrlQuery | null) => params?.projectSlug ?? null;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const projects = await getProjects();
  const paths = projects.map(({ title }) => `/projects/${slugify(title)}`);

  return { paths, fallback: "blocking" };
};

export const getStaticProps = makeGetStaticProps(getProject, getProjectSlug);

const Project = (props: Props<ResolvedProject>) => {
  const { data } = useData<ResolvedProject>(getProject, `projects/${props.slug}`, props.params);
  const project = data || props.data;

  const imageObjects = useMemo(
    () => project?.images?.map((image: ResolvedImage) => ({ image })) ?? EMPTY_ARRAY,
    [project]
  );

  const singleVideo = imageObjects.length === 1 && imageObjects[0].image?._type === "youtubeEmbed";

  return (
    <Layout projects={props.projects}>
      <Wrapper>
        {singleVideo ? (
          <YoutubePreview url={imageObjects[0].image?.url} single={singleVideo} />
        ) : (
          <ImageBeam imageObjects={imageObjects} maxHeight={70} />
        )}
      </Wrapper>
    </Layout>
  );
};

export default Project;
