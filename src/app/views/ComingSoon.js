import PageHeader from "../components/common/PageHeader.js";
import Card from "../components/common/Card.js";
import EmptyState from "../components/common/EmptyState.js";

export default function ComingSoon({ title, description, phase }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <EmptyState
          title="Under construction"
          text={`This section is delivered in ${phase} of the extended build.`}
        />
      </Card>
    </>
  );
}
