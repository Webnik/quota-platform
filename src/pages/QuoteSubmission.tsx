import { useParams } from "react-router-dom";
import { QuoteSubmissionForm } from "@/components/quotes/QuoteSubmissionForm";

const QuoteSubmission = () => {
  const { projectId, tradeId } = useParams();

  if (!projectId || !tradeId) {
    return <div>Invalid project or trade ID</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Submit Quote</h1>
      <QuoteSubmissionForm projectId={projectId} tradeId={tradeId} />
    </div>
  );
};

export default QuoteSubmission;