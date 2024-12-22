import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Trade {
  id: string;
  name: string;
  description: string | null;
}

interface Contractor {
  id: string;
  full_name: string | null;
  company_name: string | null;
}

interface ContractorSelectionProps {
  onSelect: (tradeId: string, contractorId: string) => void;
}

export function ContractorSelection({ onSelect }: ContractorSelectionProps) {
  const [open, setOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const { data: trades = [], isLoading: isLoadingTrades } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Trade[];
    },
  });

  const { data: contractors = [], isLoading: isLoadingContractors } = useQuery({
    queryKey: ["contractors", selectedTrade?.id],
    queryFn: async () => {
      if (!selectedTrade) return [];
      
      const { data, error } = await supabase
        .from("contractor_trades")
        .select(`
          contractor:profiles(
            id,
            full_name,
            company_name
          )
        `)
        .eq("trade_id", selectedTrade.id);
      
      if (error) throw error;
      return data.map(item => item.contractor) as Contractor[];
    },
    enabled: !!selectedTrade,
  });

  const handleTradeSelect = (trade: Trade) => {
    setSelectedTrade(trade);
    setSelectedContractor(null);
  };

  const handleContractorSelect = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    if (selectedTrade) {
      onSelect(selectedTrade.id, contractor.id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Select Trade</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedTrade ? selectedTrade.name : "Select trade..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search trades..." />
              <CommandEmpty>No trade found.</CommandEmpty>
              <CommandGroup>
                {trades.map((trade) => (
                  <CommandItem
                    key={trade.id}
                    onSelect={() => handleTradeSelect(trade)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTrade?.id === trade.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {trade.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTrade && (
        <div>
          <label className="text-sm font-medium mb-2 block">Select Contractor</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedContractor 
                  ? (selectedContractor.company_name || selectedContractor.full_name || "Unknown")
                  : "Select contractor..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search contractors..." />
                <CommandEmpty>No contractor found.</CommandEmpty>
                <CommandGroup>
                  {contractors.map((contractor) => (
                    <CommandItem
                      key={contractor.id}
                      onSelect={() => handleContractorSelect(contractor)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedContractor?.id === contractor.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {contractor.company_name || contractor.full_name || "Unknown"}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}