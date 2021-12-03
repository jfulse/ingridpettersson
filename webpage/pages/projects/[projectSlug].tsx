import { useMemo } from "react";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";

import { ResolvedImage, ResolvedProject } from "../../types";
import makeGetStaticProps, { Props } from "../../utils/makeGetStaticProps";
import getApiUrl from "../../utils/getApiUrl";
import fetcher from "../../utils/fetcher";
import slugify from "../../utils/slugify";
import getProjectsApiUrl from "../../utils/getProjectsApiUrl";
import useData from "../../hooks/useData";
import styled from "styled-components";
import ImageBeam from "../../components/ImageBeam";
import Layout from "../../components/Layout";
import { EMPTY_ARRAY } from "../../constants";

const getProjectSlug = (context: GetStaticPropsContext) => context.params?.projectSlug;

const getProjectApiUrl = (context: GetStaticPropsContext) =>
  `${getApiUrl()}/api/project?slug=${getProjectSlug(context)}`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  h2 {
    font-size: 1rem;
    font-weight: normal;
    margin: 0;
    padding: 0 1rem;
  }
`;

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const projects = await fetcher<ResolvedProject[]>(getProjectsApiUrl());
  const paths = projects.map(({ title }) => `/projects/${slugify(title)}`);

  return { paths, fallback: "blocking" };
};

export const getStaticProps = makeGetStaticProps(getProjectApiUrl, getProjectSlug);

const Project = (props: Props<ResolvedProject>) => {
  const { data } = useData<ResolvedProject>(props.dataUrl);
  const project = data || props.data;

  const imageObjects = useMemo(
    () => project?.images?.map((image: ResolvedImage) => ({ image })) ?? EMPTY_ARRAY,
    [project]
  );

  return (
    <Layout projects={props.projects}>
      <Wrapper>
        <h2>
          {project?.title} ({project?.year})
        </h2>
        <ImageBeam imageObjects={imageObjects} maxHeight={70} />
      </Wrapper>
    </Layout>
  );
};

export default Project;
