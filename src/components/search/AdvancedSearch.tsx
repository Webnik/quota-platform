import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from "lucide-react";

export const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [status, setStatus] = useState("all");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['advanced-search', searchTerm, selectedTrade, dateRange, priceRange, status],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          contractor:contractor_id (
            full_name,
            company_name
          ),
          project:project_id (
            name,
            status,
            description
          ),
          trade:trade_id (
            name
          )
        `);

      // Apply filters
      if (searchTerm) {
        query = query.or(`project.name.ilike.%${searchTerm}%,project.description.ilike.%${searchTerm}%`);
      }
      if (selectedTrade !== "all") {
        query = query.eq('trade_id', selectedTrade);
      }
      if (dateRange.from && dateRange.to) {
        query = query.gte('created_at', dateRange.from).lte('created_at', dateRange.to);
      }
      if (status !== "all") {
        query = query.eq('status', status);
      }
      query = query.gte('amount', priceRange[0]).lte('amount', priceRange[1]);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!(searchTerm || selectedTrade !== "all" || dateRange.from || status !== "all" || priceRange[0] !== 0)
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, contractors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Trade</label>
            <Select value={selectedTrade} onValueChange={setSelectedTrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={1000}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {isLoading ? (
          <div>Loading results...</div>
        ) : searchResults?.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">{result.project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {result.contractor.company_name || result.contractor.full_name}
                </p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>{result.trade.name}</span>
                  <span>${result.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No results found
          </div>
        )}
      </CardContent>
    </Card>
  );
};