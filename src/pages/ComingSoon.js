import PageHeader from "../common/PageHeader";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

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
