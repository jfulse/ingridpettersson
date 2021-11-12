import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";

import { ResolvedProject } from "../../types";
import makeGetServerSideProps, {
  Props,
} from "../../utils/makeGetServerSideProps";
import useData from "../../hooks/useData";

const API_URL = "http://localhost:3000";

const getProjectSlug = (context: GetServerSidePropsContext) =>
  context.query?.projectSlug;

const getProjectApiUrl = (context: GetServerSidePropsContext) =>
  `${API_URL}/api/project?slug=${getProjectSlug(context)}`;

export const getServerSideProps = makeGetServerSideProps(
  getProjectSlug,
  getProjectApiUrl
);

const Project = (props: Props<ResolvedProject>) => {
  const { data } = useData(props.apiUrl);
  const project = data || props.data;

  return (
    <>
      <div>
        Project: {project.title} - {project.year} ({props.slug})
      </div>
      <br />
      <br />
      <div>Data: {JSON.stringify(project)}</div>
    </>
  );
};

export default Project;
