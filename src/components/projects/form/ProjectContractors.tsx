import { ContractorSelection } from "../ContractorSelection";

interface ProjectContractorsProps {
  selectedContractors: Array<{ tradeId: string; contractorId: string }>;
  onContractorSelect: (tradeId: string, contractorId: string) => void;
}

export function ProjectContractors({
  selectedContractors,
  onContractorSelect,
}: ProjectContractorsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Contractors</h3>
      <ContractorSelection onSelect={onContractorSelect} />
      {selectedContractors.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedContractors.length} contractor
          {selectedContractors.length === 1 ? "" : "s"} selected
        </p>
      )}
    </div>
  );
}