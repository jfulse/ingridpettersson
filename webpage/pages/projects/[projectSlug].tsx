import { useRouter } from "next/router";

import useData from "../../hooks/useData";

const Project = () => {
  const router = useRouter();
  const { projectSlug } = router.query;

  const {
    data: project = {},
    loading,
    error,
  } = useData(`api/project?slug=${projectSlug}`);
  // TODO: loading and error

  return (
    <>
      <div>Project: {projectSlug}</div>
      <br />
      <br />
      <div>Data: {JSON.stringify(project)}</div>
    </>
  );
};

export default Project;
