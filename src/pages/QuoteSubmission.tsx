import { useParams } from "react-router-dom";
import { QuoteSubmissionForm } from "@/components/quotes/QuoteSubmissionForm";

const QuoteSubmission = () => {
  const { projectId, tradeId } = useParams();

  if (!projectId || !tradeId) {
    return <div>Missing required parameters</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Submit Quote</h1>
      <QuoteSubmissionForm projectId={projectId} tradeId={tradeId} />
    </div>
  );
};

export default QuoteSubmission;