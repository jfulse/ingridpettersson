import { GetServerSidePropsContext } from "next";

import { ResolvedProject } from "../../types";
import makeGetServerSideProps, {
  Props,
} from "../../utils/makeGetServerSideProps";
import useData from "../../hooks/useData";
import styled from "styled-components";
import ImageBeam from "../../components/ImageBeam";

const API_URL = "http://localhost:3000";

const getProjectSlug = (context: GetServerSidePropsContext) =>
  context.query?.projectSlug;

const getProjectApiUrl = (context: GetServerSidePropsContext) =>
  `${API_URL}/api/project?slug=${getProjectSlug(context)}`;

const Wrapper = styled.div`
  height: 100%;

  h2 {
    font-size: 1rem;
    font-weight: normal;
    margin: 0;
    padding: 1rem;
  }
`;

export const getServerSideProps = makeGetServerSideProps(
  getProjectApiUrl,
  getProjectSlug
);

const Project = (props: Props<ResolvedProject>) => {
  const { data } = useData(props.apiUrl);
  const project = data || props.data;

  return (
    <Wrapper>
      <h2>
        {project.title} ({project.year})
      </h2>
      <br />
      <br />
      <ImageBeam images={project.images} />
    </Wrapper>
  );
};

export default Project;
